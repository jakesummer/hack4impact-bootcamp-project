import {db} from "../firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect} from "react";
import "../App.css";
import type {Wishlist, WishlistWithName} from "../types.ts";
import { useNavigate } from 'react-router';

export default function WishlistPage() {

  const [wishlistsWithName, setWishlistsWithName] = useState<WishlistWithName[]>([]);
  const navigate = useNavigate();

  useEffect(() => { 
    async function getData() {
      const [wishlistsSnap, usersSnap] = await Promise.all([
       getDocs(collection(db, "wishlists")),
       getDocs(collection(db, "users")),
      ]);
      const nameMap = new Map<string, string>(usersSnap.docs.map((doc) => [doc.id, doc.data().name]));
      const mergedWishlists: WishlistWithName[] = wishlistsSnap.docs.map((doc) => {
      const wishlist = doc.data() as Wishlist;
      return {
        ...wishlist,associatedName: nameMap.get(wishlist.participantId) ?? "Unknown",
      };
      });
      setWishlistsWithName(mergedWishlists);
      }  
      getData();  
    }, [])
return (
  
  
  <div>
    <div>
    <div className="w-full bg-green-medium text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
      <p className="font-cinzel text-lg">Winter Wishlist Assoc.</p>
    </div>
    <div className="bg-cream-light min-h-screen">
      <div className="px-20 py-5 flex-col flex-wrap justify-between">
        <h1 className="participantTitle text-2xl text-green-medium">Family Wishlist</h1>
        <p className="text-sm">See every family’s needs and fulfillment progress at a glance.</p>

      </div>
    
      <div className="flex flex-col gap-6 p-8">
        {wishlistsWithName.map((wishlist, index) => {
      const matchedCount = wishlist.items.filter((item) => item.matched).length;

      let statusLabel = "Not Started";
      let statusClasses = "text-red-medium bg-red-light border-red-medium";

      if (wishlist.items.length > 0 && matchedCount === wishlist.items.length) {
      statusLabel = "Complete";
      statusClasses = "text-green-medium bg-green-verylight border-green-medium";
    } else if (matchedCount > 0) {
      statusLabel = "In Progress";
      statusClasses = "text-yellow-medium bg-yellow-light border-yellow-medium";
    }

      return (
        <div key={index}>
          <div className="bg-white px-5 py-5 rounded-xl text-black text-sm shadow-xl">
            <h3>{wishlist.associatedName}'s Family</h3>
            <p>
              Matched: {matchedCount} / {wishlist.items.length}
            </p>
            <p
          className={`flex ml-auto px-2 py-1 rounded-3xl text-sm border-2 border-solid ${statusClasses}`}
          >
          {statusLabel}
        </p>
        <button className="bg-cream-light px-5 py-2 rounded-xl text-black text-sm shadow-xl" onClick={() => navigate('/', { state: wishlist.participantId })}>View Wishlist</button>
          </div>
        </div>
      );
      })}
        
      </div>
    </div>
  </div>







    
  </div>



)
}