import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = []
    }
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id)
        //splice [2, 3, 4, 5].splice(1, 1 [num of elem]) ==> return 3 and mutate original arrey yo [2, 4, 5]
        //slice [2, 3, 4, 5].splice(1, 2 [position]) ==> return 3 and leve same original arrey yo [2, 3, 4, 5]
        this.items.splice(index, 1);
    }
    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}