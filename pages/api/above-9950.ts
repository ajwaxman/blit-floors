import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import terraformMetadata from '../../data/terraforms.json'


const options = { method: 'GET' };

const fetchTerraformPage = async (ids: string[]) => {
    let url = 'https://api.opensea.io/api/v1/assets?collection=terraforms&'
    url += ids.map((id) => `token_ids=${id}`).join('&')

    const res = await fetch(url, options);
    const json = await res.json()
    return json.assets
}

export interface TerraformInfo {
    id: string
    price: Number
    seed: Number
    url: string
    svg: string
}


export const fetchAbove9950 = async () => {
    // Get IDs for Terraforms with seeds over 9000
    let above9950 = [];
    var _ = require('lodash');

    const mappedMetadata = flatten(terraformMetadata)
        .filter((t) => {
            return t.seedValue > 9950
            // return t.level == 5
        })

    _.forEach(mappedMetadata, function(t){
        above9950.push(t.tokenId);
    })

    const chunkedabove9950 = chunk(above9950, 20)

    const data = await pMap(chunkedabove9950, fetchTerraformPage, { concurrency: 2 })
    const mapped = flatten(data)
        .filter((d) => {
            return d.sell_orders && d.sell_orders.length > 0 && d.sell_orders[0].payment_token_contract.symbol == 'ETH'
        })
        .map((a): TerraformInfo => {
            return {
                id: a.token_id,
                price: Number(
                    etherUtils.formatUnits(
                        BigNumber.from(a.sell_orders[0].current_price.split('.')[0]),
                    ),
                ),
                seed: terraformMetadata[a.token_id -1]["seedValue"],
                url: a.permalink,
                svg: a.image_url,
            }
        })
    return {
        terraforms: orderBy(mapped, ['price', 'id'], ['asc', 'asc']),
        lastUpdate: new Date().toISOString(),
        outOf: above9950.length
    }
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await fetchTerraforms()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
