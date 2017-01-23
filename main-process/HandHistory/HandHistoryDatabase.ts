import * as path from 'path';
import * as Datastore from 'nedb';
import * as Rx from 'rxjs';

import Utils from '../Utils/Utils';
import Hand from '../../common/models/Hand';

class HandHistoryDatabase {
    private db: Datastore;
    private dbPath: string = path.join(Utils.getAppDataPath(), 'hand_history.db');

    constructor() {
        this.db = new Datastore({ filename: this.dbPath, autoload: true });
        this.db.ensureIndex({ fieldName: 'id', unique: true });
    }

    find(params: {playerNames: string[]}): Rx.Observable<Hand[]> {
        return Rx.Observable.create((subscriber) => {
            this.db.find({ playerNames: { $in: params.playerNames } }, (err, docs) => {
                if (err) {
                    throw err;
                }
                subscriber.next(docs);
                subscriber.complete();
            });
        });
    }

    upsert(object: Hand) {
        this.db.update({ id: object.id }, object, { upsert: true });
    }
}

export default new HandHistoryDatabase();
