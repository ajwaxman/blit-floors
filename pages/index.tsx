import { TerraformInfo, fetchTerraforms } from './api/terraforms'
import { format as ts } from 'timeago.js'
import terraformsMetadata from '../data/terraforms.json'

export async function getStaticProps() {
    const data = await fetchTerraforms()
    return {
        props: {
            terraforms: data.terraforms,
            lastUpdate: data.lastUpdate
        },
        revalidate: 300,
    }
}

interface Props {
    terraforms: TerraformInfo[]
    lastUpdate: string
}

const Terraform = ({ terraform }: { terraform: TerraformInfo }) => {
    return (
        <a href={terraform.url} target="_blank">
            <div className="m-auto text-white pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 transform hover:scale-105 active:scale-100 duration-300 transition-all w-full md:w-96">
                <img className="" src={terraform.svg} />
                <div className="text-center">
                    <p className="text-lg">#{terraform.id}</p>
                    <p className="text-gray-300">{terraform.price} ETH <span className="px-2">·</span> <span className="pr-0">Seed:</span> {terraform.seed}</p>
                </div>
            </div>
        </a>
    )
}

const Home = ({ terraforms, lastUpdate }: Props) => {
    return (
        <div className="py-3 md:pb-0 font-mono tracking-tighter flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
            <h1 className="text-lg text-[#68d000] md:text-2xl font-bold mt-10 mb-5"><span className="pr-1.5">🌱</span> Seed Sniper</h1>
            {/* <h3 className="text-sky-300 text-xl font-bold">BY SEED</h3> */}
            <ul>
                <li className="mb-3">👑 <a href="/origin-x-seeds" className="underline">Origin X SEEDS</a><span className="text-slate-600"> (14 available)</span></li>
                <li className="mb-3">🏆 <a href="/x-seeds" className="underline">X SEEDS</a><span className="text-slate-600"> (34 available)</span></li>
                <li className="mb-3">🌳 <a href="/above-9950" className="underline"> SEED {">"} 9950</a><span className="text-slate-600"> (54 available)</span></li>
                <li className="mb-3">🌿 <a href="/above-9900" className="underline"> SEED {">"} 9900</a><span className="text-slate-600"> (104 available)</span></li>
                <li className="mb-3">🌱 <a href="/under-100" className="underline"> SEED {"<"} 100</a><span className="text-slate-600"> (105 available)</span></li>
                <li className="mb-3">✋ <a href="/level-five" className="underline"> Level 5</a><span className="text-slate-600"> (217 available)</span></li>
            </ul>
        </div>
    )
}

export default Home