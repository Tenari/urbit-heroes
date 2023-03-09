import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import Tome from '@holium/tome-db';
import { Charges, ChargeUpdateInitial, scryCharges } from '@urbit/api';
import { maps } from './maps';
import { defaults } from './defaults';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;

const db = await Tome.init(api, 'heroes', {
    realm: true
})
const gameKV = await db.keyvalue({
    bucket: 'game',
    permissions: { read: 'open', write: 'our', admin: 'our' },
    preload: false,
})
const mapsKV = await db.keyvalue({
    bucket: 'maps',
    permissions: { read: 'space', write: 'our', admin: 'our' },
    preload: false,
})
const entitiesKV = await db.keyvalue({
    bucket: 'entities',
    permissions: { read: 'open', write: 'space', admin: 'our' },
    preload: false,
})

export function App() {
  const [game, setGame] = useState(null);
  useEffect(() => {
    gameKV.get('game').then(v => {
      if (!v) {
        gameKV.set('game', defaults.game);
        setGame(defaults.game);
      } else {
        setGame(v)
      }
    });
  }, []);
  console.log(maps);
  console.log(game);
  console.log(maps[game?.map]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="max-w-md space-y-6 py-20">
        <h1 className="text-3xl font-bold">Welcome to heroes</h1>
        <p>Here&apos;s your urbit&apos;s installed apps:</p>
        {apps && (
          <ul className="space-y-4">
            {Object.entries(apps).map(([desk, app]) => (
              <li key={desk} className="flex items-center space-x-3 text-sm leading-tight">
                <AppTile {...app} />
                <div className="flex-1 text-black">
                  <p>
                    <strong>{app.title || desk}</strong>
                  </p>
                  {app.info && <p>{app.info}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
