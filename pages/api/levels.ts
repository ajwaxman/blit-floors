import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import terraformMetadata from '../../data/terraforms.json'
import levelsData from '../../data/levels.json'


const fetchLevelFloor = async (id) => {
    let url = 'https://indexer-v3-api-production.up.railway.app/tokens?collection=terraforms&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=1&attributes%5BLevel%5D='
    url += id

    const res = await fetch(url);
    const json = await res.json()
    return json["tokens"][0]["market"]["floorSell"]["value"]
}

export interface LevelInfo {
    level: Number
    quantity: Number
    floor: Number
    url: string
    rarity: string
    css: string
}

const getRarity = (quantity) => {
    let rarity = {};
    if (quantity < 25) {
        rarity = { "id":0, "name": "🥇 Mythic", "css":"bg-[#725e1d] text-[#F3EACE]"};
    } else if (quantity < 100) {
        rarity = { "id":1, "name": "🥈 Legendary", "css":"bg-[#4A4A4A] text-[#f2f2f2]"};
    } else if (quantity < 300) {
        rarity =  { "id":2, "name": "🥉 Epic", "css":"bg-[#552C02] text-[#FFE9D6]"};
    } else if (quantity < 600) {
        rarity =  { "id":3, "name": "Rare", "css":"bg-yellow-50 text-yellow-800"};
    } else if (quantity < 1000){
        rarity = { "id":4, "name": "Uncommon", "css":"bg-orange-50 text-orange-800"};
    } else {
        rarity = { "id":5 ,"name": "Common", "css":"bg-red-50 text-red-800"};
    }
    return rarity;
}

export const fetchLevels = async () => {
    
    let levels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    let rarityFloors = {
        0: {
            "name": "🥇 Mythic",
            "floor": 600 
        },
        1: {
            "name": "🥈 Legendary",
            "floor": 500 
        },
        2: {
            "name": "🥉 Epic",
            "floor": 400 
        },
        3: {
            "name": "Rare",
            "floor": 300 
        },
        4: {
            "name": "Uncommon",
            "floor": 200 
        },
        5: {
            "name": "Common",
            "floor": 100 
        }
    }
    let levelsMetadata = levelsData;
    var _ = require('lodash');

    const apiData = await pMap(levels, fetchLevelFloor, { concurrency: 2 })
    const mapped = levelsMetadata
        .map((a, index): LevelInfo => {
            if (apiData[a.level - 1] < rarityFloors[getRarity(a.quantity)["id"]]["floor"]) {
                rarityFloors[getRarity(a.quantity)["id"]]["floor"] = apiData[a.level - 1]
            }
            // console.log(rarityFloors[getRarity(a.quantity)["name"]])
            // console.log(apiData[a.level - 1])
            // if (apiData[a.level - 1] < rarityFloors(getRarity(a.quantity)["name"])) {
            //     rarityFloors(getRarity(a.quantity)["name"]) = apiData[a.level - 1] 
            // }
            return {
                level: a.level,
                quantity: a.quantity,
                floor: apiData[a.level - 1 ] ? apiData[a.level - 1] : null,
                url:"https://opensea.io/assets/terraforms?search[numericTraits][0][name]=Level&search[numericTraits][0][ranges][0][max]="+a.level+"&search[numericTraits][0][ranges][0][min]="+a.level+"&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW",
                rarity: getRarity(a.quantity)["name"],
                css: getRarity(a.quantity)["css"]
            }
        })
    return {
        levels: mapped,
        rarityFloors: rarityFloors,
        lastUpdate: new Date().toISOString()
    }
}


const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await fetchLevels()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
