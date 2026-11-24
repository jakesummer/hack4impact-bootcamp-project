import {db} from "../firebase/firebase";
import { doc, getDocs, updateDoc, query, where, collection } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth.tsx"
import "../App.css";
import type {Wish} from "../types.ts";
import LabeledInput from "../components/LabeledInput.tsx";

export default function ParticipantDashboard() {
    // used to store the current array of wishes
    const [wishes, setWishes] = useState<Wish[]>();
    // const [username, setUsername] = useState<string>();
    const [wishlistId, setWishlistId] = useState<string>();
    const [editingWish, setEditingWish] = useState<Wish | null>();
    const {currentUser, userData} = useAuth();
    const uid = userData?.uid;
    

    // used for popups
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dialogRefEdit = useRef<HTMLDialogElement>(null);

    /* 
    tracks the wishname, for example: the program adds a new wish, and that becomes
    the new wish, or when the program is creating the html to view lets say the
    third wish, wishname is that third wish
    */
    const [wishName, setWishName] = useState<string>("");
    // flip is a dependency of useEffect, so when it's flipped, the wishlist is rerendered
    const [flip, setFlip] = useState<boolean>(true);

    /* 
    for popups, openModal opens the popup, closeModal closes it, 
    openModelEdit and closeModelEdit are a second popup for editing wishes. They're 
    very similar, but there are a few important changes 
    (like calling editWish instead of addWish) which requires another popup.
    */
    const openModal = () => {
      setWishName("");
      dialogRef.current?.showModal();
    };

    const closeModal = () => {
      dialogRef.current?.close();

    };

    const openModalEdit = () => {
      dialogRefEdit.current?.showModal();
    };

    const closeModalEdit = () => {
      dialogRefEdit.current?.close();

    };

    // updating wishes
    const addWish = async () => {
      if (!wishlistId) return;

      const user = doc(db, "wishlists", wishlistId);
      const newWish: Wish = {
        itemName: wishName,
        matched: false,
        matchedDonationId: ""
      };
      const updatedWishlist = [...(wishes ?? []), newWish];
      await updateDoc(user, {
        items: updatedWishlist,
        participantId: uid
      });
      setFlip(!flip);
      setWishName("");
    }

    const deleteWish = async (name: string, matched: boolean, matchedDonationId: string) => {
      if (!wishes || !wishlistId) return;

      const user = doc(db, "wishlists", wishlistId);
      const updatedWishlist = wishes.filter((wish) => (wish.itemName !== name ||
      wish.matched !== matched || wish.matchedDonationId !== matchedDonationId));
      await updateDoc(user, {
        items: updatedWishlist,
        participantId: uid
      });
      setFlip(!flip);
    }

    const editWish = async (name: string, newName: string | undefined, matched: boolean | undefined,
      matchedDonationId: string) => {
      if (!wishes || !wishlistId) return;

      const user = doc(db, "wishlists", wishlistId);
      const newWish: Wish = {
        itemName: newName,
        matched: matched,      // RIGHT NOW IF YOU EDIT A WISH, IT IS RESET BACK TO NOT MATCHED
        matchedDonationId: matchedDonationId
      };
      const updatedWishlist = wishes.map((wish) => 
        wish.itemName === name && wish.matched === matched && wish.matchedDonationId === matchedDonationId
      ? newWish : wish);
      await updateDoc(user, {
        items: updatedWishlist,
        participantId: uid
      });
      setFlip(!flip);
      setWishName("");
    }

    // renders the wishes
    useEffect(() => {
        async function getData() {
            if (!uid) return;

            const q = query(collection(db, "wishlists"), 
            where("participantId", "==", uid));
            const querySnapshot = await getDocs(q);
            const wishlist = querySnapshot.docs[0];
            const data = wishlist.data().items;
            setWishes(data);
            setWishlistId(wishlist.id);
        }  

        getData();  
    }, [currentUser, uid, flip])


    return (
      <div>
        <div className="w-full bg-green-medium text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-cinzel text-lg">Winter Wishlist Assoc.</p>
        </div>
        <div className="bg-cream-light min-h-screen">
          <div className="px-20 py-5 flex flex-wrap justify-between">
            <h1 className="participantTitle text-2xl text-green-medium">{userData?.name}'s Wishlist</h1>
            <button className="bg-green-light px-5 py-2.5 rounded-sm text-white text-sm" type="button" onClick={openModal}>+ Add to Wishlist</button>
          </div>
          <dialog ref={dialogRef} className="m-auto p-8 rounded-md bg-white shadow-xl">
            <div className="flex flex-col gap-6">
              <div>
                <button className="flex w-full justify-end" type="button" onClick={closeModal}>X</button>
                <p className="text-center text-xl">Add to Wishlist</p>
              </div>
              <div>
                <LabeledInput 
                labelText = "Item Name" 
                inputName = "wishName"
                required = {true}
                value={wishName}
                onChange={(e) => {
                    setWishName(e.target.value);
                  }}>
                </LabeledInput>
              </div>
              <button 
              className="bg-green-medium px-5 py-2.5 rounded-sm text-white text-sm"
              type="button" onClick={() => {
                closeModal();
                addWish();
              }}>Add to Wishlist</button>
            </div>
          </dialog>
          <dialog ref={dialogRefEdit} className="m-auto p-8 rounded-md bg-white shadow-xl">
            <div className="flex flex-col gap-6">
              <div>
                <button className="flex w-full justify-end" type="button" onClick={closeModalEdit}>X</button>
                <p className="text-center text-xl">Edit wish</p>
              </div>
              <div>
                <LabeledInput 
                labelText = "Item Name" 
                inputName = "wishName"
                required = {true}
                value={wishName}
                onChange={(e) => {
                    setWishName(e.target.value);
                  }}>
                </LabeledInput>
              </div>
              <button 
              className="bg-green-medium px-5 py-2.5 rounded-sm text-white text-sm"
              type="button" onClick={() => {
                if (!editingWish) return;
                closeModalEdit();
                editWish(editingWish.itemName ?? "", wishName, editingWish.matched ?? false, editingWish.matchedDonationId ?? "");
              }}>Edit Wish</button>
            </div>
          </dialog>
          <div className="flex flex-col gap-6 p-8">
            {wishes?.map((wish, index) => (
              <div key={index} className="outline outline-black rounded-sm p-6 shadow-lg flex">
                <p className="px-5">{wish.itemName}</p>
                <p className={`flex ml-auto px-2 py-1 rounded-3xl text-sm border-2 border-solid 
                  ${wish.matched ? "text-green-medium bg-green-light border-green-medium" : "text-red-medium bg-red-light border-red-medium"}`}>
                  {wish.matched ? "Matched" : "Unmatched"}</p>
                <button className="flex justify-end px-4" type="button" onClick={() => {
                  setEditingWish(wish);
                  setWishName(wish.itemName ?? "");
                  openModalEdit();
                }}>Edit</button>
                <button className="flex justify-end" type="button" onClick={() => {
                  deleteWish(wish.itemName ?? "", wish.matched ?? false, wish.matchedDonationId ?? "")
                }}>X</button>
              </div>
            ))}
          </div>
        </div>
      </div>   
    )

}
