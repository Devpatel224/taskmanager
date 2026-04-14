import { db } from "@/lib/firebase";
import { setTasks } from "@/redux/taskSlice";
import { collection, onSnapshot, query } from "firebase/firestore";



export const subscribeToTasks = (dispatch: any) => {

  const q = query(collection(db, "tasks"));

 
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

dispatch(setTasks(tasks))
    
  });
};


