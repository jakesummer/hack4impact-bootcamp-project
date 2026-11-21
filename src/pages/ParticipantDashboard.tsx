import {db} from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth.tsx"
import "./ParticipantDashboard.css";

export default function ParticipantDashboard() {
    // used to store the current array of wishes
    const [wishes, setWishes] = useState<string[]>([]);
    const [username, setUsername] = useState<string[]>([]);
    const {currentUser} = useAuth();
    const uid = currentUser?.uid;

    // used for popups
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dialogRefEdit = useRef<HTMLDialogElement>(null);

    /* 
    tracks the wishname, for example: the program adds a new wish, and that becomes
    the new wish, or when the program is creating the html to view lets say the
    third wish, wishname is that third wish
    */
    const [wishName, setWishName] = useState<string>();
    // flip is a dependency of useEffect, so when it's flipped, the wishlist is rerendered
    const [flip, setFlip] = useState<boolean>(true);

    /* 
    for popups, openModal opens the popup, closeModal closes it, 
    openModelEdit and closeModelEdit are a second popup for editing wishes. They're 
    very similar, but there are a few important changes 
    (like calling editWish instead of addWish) which requires another popup.
    */
    const openModal = () => {
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
      const user = doc(db, "users", uid);
      const updatedWishlist = [...wishes, wishName];
      await updateDoc(user, {
        Wishlist: updatedWishlist
      });
      setFlip(!flip);
    }

    const deleteWish = async (name: string) => {
      const user = doc(db, "users", uid);
      const updatedWishlist = wishes.filter((wish) => wish !== name);
      await updateDoc(user, {
        Wishlist: updatedWishlist
      });
      setFlip(!flip);
    }

    const editWish = async (name: string, newName: string | undefined) => {
      const user = doc(db, "users", uid);
      const updatedWishlist = wishes.map((wish) => wish === name ? newName: wish);
      await updateDoc(user, {
        Wishlist: updatedWishlist
      });
      setFlip(!flip);
    }

    // renders the wishes
    useEffect(() => {
        async function getData() {
            const wishes = doc(db, "users", uid);
            const user = await getDoc(wishes);
            const userData = user.data();
            setWishes(userData.Wishlist);
            setUsername(userData.name);
        }  

        getData();  
    }, [currentUser, uid, flip])


    return (
      <div>
        <div className="w-full bg-[#3F4E45] text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-cinzel text-lg">Winter Wishlist Assoc.</p>
        </div>
        <div className="bg-[#F8F4F0] min-h-screen">
          <div className="px-20 py-5 flex flex-wrap justify-between">
            <h1 className="participantTitle text-2xl text-[#3F4E45]">{username}'s Wishlist</h1>
            <button className="bg-emerald-950 px-5 py-2.5 rounded-sm text-white text-sm" type="button" onClick={openModal}>+ Add to Wishlist</button>
          </div>
          <dialog ref={dialogRef} className="m-auto p-8 rounded-md bg-white shadow-xl">
            <div className="flex flex-col gap-6">
              <div>
                <button className="flex w-full justify-end" type="button" onClick={closeModal}>X</button>
                <p className="text-center text-xl">Add to Wishlist</p>
              </div>
              <div>
                <p className="text-sm">Item Name</p>
                <input
                  className="outline outline-black rounded-sm" 
                  type="text"
                  value={wishName}
                  onChange={(e) => {
                    setWishName(e.target.value);
                  }}
                />
              </div>
              <button 
              className="bg-emerald-950 px-5 py-2.5 rounded-sm text-white text-sm"
              type="button" onClick={() => {
                closeModal();
                addWish();
              }}>Add to Wishlist</button>
            </div>
          </dialog>
          <div className="flex flex-col gap-6 p-8">
            {wishes.map((wish) => (
              <div className="outline outline-black rounded-sm p-6 shadow-lg flex">
                <p>{wish}</p>
                <button className="flex w-full justify-end px-4" type="button" onClick={() => {
                  openModalEdit();
                  setWishName(wish);
                }}>Edit</button>
                <dialog ref={dialogRefEdit} className="m-auto p-8 rounded-md bg-white shadow-xl">
                  <div className="flex flex-col gap-6">
                    <div>
                      <button className="flex w-full justify-end" type="button" onClick={closeModalEdit}>X</button>
                      <p className="text-center text-xl">Edit wish</p>
                    </div>
                    <div>
                      <p className="text-sm">Item Name</p>
                      <input
                        className="outline outline-black rounded-sm" 
                        type="text"
                        value={wishName}
                        onChange={(e) => {
                          setWishName(e.target.value);
                        }}
                      />
                    </div>
                    <button 
                    className="bg-emerald-950 px-5 py-2.5 rounded-sm text-white text-sm"
                    type="button" onClick={() => {
                      closeModalEdit();
                      editWish(wish, wishName);
                    }}>Edit Wish</button>
                  </div>
                </dialog>
                <button className="flex justify-end" type="button" onClick={() => {
                  deleteWish(wish)
                }}>X</button>
              </div>
            ))}
          </div>
        </div>
      </div>   
    )

}
