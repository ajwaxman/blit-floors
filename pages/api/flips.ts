import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import compositionData from '../../data/compositions.json'
import compositionTestData from '../../data/compositions-test.json'

const exampleFlipmapUrl = "https://indexer-v3-api-production.up.railway.app/tokens?collection=flipmap&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=5&attributes%5BComposition%5D=Dunce%20(%2368)"
const exampleTerraformUrl = "https://indexer-v3-api-production.up.railway.app/tokens?collection=terraforms&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=6&attributes%5BLevel%5D=5"



const fetchCompositions = async (offset) => {
    let url = "https://indexer-v3-api-production.up.railway.app/collections/flipmap/attributes?attribute=Composition&limit=20&offset="
    url += offset;
    
    var _ = require('lodash');

    const res = await fetch(url);
    const json = await res.json()
    const attributes = json["attributes"]

    let attributesArray = [];
    
    _.forEach(attributes, function(a) {
        // console.log(a["value"]);
        attributesArray.push(a["value"]);
    });
    return attributesArray
}

const fetchFlipFloor = async (name) => {
    let url = "https://indexer-v3-api-production.up.railway.app/tokens?collection=flipmap&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=6&attributes%5BComposition%5D="
    url += encodeURIComponent(name);

    const res = await fetch(url)
    const json = await res.json()
    return json["tokens"]
}


const fetchLevelFloor = async (id) => {
    let url = 'https://indexer-v3-api-production.up.railway.app/tokens?collection=terraforms&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=1&attributes%5BLevel%5D='
    url += id

    const res = await fetch(url)
    const json = await res.json()
    return json["tokens"][0]["market"]["floorSell"]["value"]
}

export interface FlipInfo {
    name: string
    item_number: Number
    floor: Number
    one_away: Number
    three_away: Number
    five_away: Number
    url: string 
}

export const fetchFlips = async () => {

    var _ = require('lodash');

    let compositions = compositionData;

    const apiData = await pMap(compositions, fetchFlipFloor, { concurrency: 2 })

    const mapped = compositionData
        .map((c, index): LevelInfo => {
            console.log(c);
            console.log(apiData[index][3]["market"]["floorSell"]["value"])
            return {
                name: c,
                item_number: c.split("#").pop().split(')')[0],
                floor: Math.round(apiData[index][0]["market"]["floorSell"]["value"] * 100) / 100,
                one_away: Math.round(apiData[index][1]["market"]["floorSell"]["value"] * 100) / 100,
                three_away: Math.round(apiData[index][3]["market"]["floorSell"]["value"] * 100) / 100,
                five_away: Math.round(apiData[index][5]["market"]["floorSell"]["value"] * 100) / 100,
                url:"https://opensea.io/assets/flipmap?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Composition&search[stringTraits][0][values][0]="+escape(c)+"&search[toggles][0]=BUY_NOW",
            }
        })
    return {
        flips: orderBy(mapped, ['floor'], ['desc']),
        compositions: compositions,
        lastUpdate: new Date().toISOString()
    }
}



export interface LevelInfo {
    level: Number
    quantity: Number
    floor: Number
    url: string
    rarity: string
    css: string
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
