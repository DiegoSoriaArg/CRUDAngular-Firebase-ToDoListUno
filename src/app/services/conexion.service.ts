import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Item { name: string; }
export interface ItemId extends Item { id: string; }


@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private shirtCollection: AngularFirestoreCollection<Item>;
  items: Observable<ItemId[]>;

  private itemDoc: AngularFirestoreDocument<Item>;

  constructor(private afs: AngularFirestore) { 
    this.shirtCollection = afs.collection<Item>('items');
    this.items = this.shirtCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  listaItem(){
    return this.items;
  }

  agregarItem(item: Item){
    this.shirtCollection.add(item);
  }

  eliminarItem(item){
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`);
    this.itemDoc.delete();
  }

  editarItem(item){
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`);
    this.itemDoc.update(item);
  }

}
