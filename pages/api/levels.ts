import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import terraformMetadata from '../../data/terraforms.json'
import levelsData from '../../data/levels.json'


const fetchLevelFloor = async (id: string) => {
    let url = 'https://indexer-v3-api-production.up.railway.app/tokens?collection=terraforms&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=1&attributes%5BLevel%5D='
    url += id

    const res = await fetch(url);
    const json = await res.json()
    console.log("hello");
    return json["tokens"][0]["market"]["floorSell"]["value"]
    // return json.tokens
}

export interface LevelInfo {
    level: string
    quantity: Number
    floor: Number
    url: string
    rarity: string
    css: string
}

const getRarity = (quantity) => {
    let rarity = "";
    if (quantity < 25) {
        rarity = { "name": "🥇 Mythic", "css":"bg-[#725e1d] text-[#F3EACE]"};
    } else if (quantity < 100) {
        rarity = { "name": "🥈 Legendary", "css":"bg-[#4A4A4A] text-[#f2f2f2]"};
    } else if (quantity < 300) {
        rarity =  { "name": "🥉 Epic", "css":"bg-[#552C02] text-[#FFE9D6]"};
    } else if (quantity < 600) {
        rarity =  { "name": "Rare", "css":"bg-yellow-50 text-yellow-800"};
    } else if (quantity < 1000){
        rarity = { "name": "Uncommon", "css":"bg-orange-50 text-orange-800"};
    } else {
        rarity = { "name": "Common", "css":"bg-red-50 text-red-800"};
    }
    return rarity;
}

export const fetchLevels = async () => {
    // Get IDs for Terraforms with seeds over 9000
    let levels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    let levelsMetadata = levelsData;
    var _ = require('lodash');

    const apiData = await pMap(levels, fetchLevelFloor, { concurrency: 2 })
    console.log(apiData)
    const mapped = levelsMetadata
        .map((a): LevelInfo => {
            console.log("Hello");
            return {
                level: a.level,
                quantity: a.quantity,
                floor: apiData[a.level - 1 ] ? apiData[a.level - 1] : null,
                url:"https://opensea.io/assets/terraforms?search[numericTraits][0][name]=Level&search[numericTraits][0][ranges][0][max]="+a.level+"&search[numericTraits][0][ranges][0][min]="+a.level+"&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW",
                rarity: getRarity(a.quantity).name,
                css: getRarity(a.quantity).css
            }
        })
    return {
        levels: mapped,
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
