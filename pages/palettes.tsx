import { LevelInfo, fetchFlips, FlipInfo } from './api/palettes'
import { format as ts } from 'timeago.js'

export async function getStaticProps() {
    const data = await fetchFlips()
    // console.log(data)
    return {
        props: {
            flips: data.flips,
            compositions: data.compositions,
            lastUpdate: data.lastUpdate
        },
        revalidate: 250,
    }
}

interface Props {
    flips: FlipInfo[]
    compositions: String[]
    lastUpdate: string
}

const FlipFloor = ({ flips, compositions, lastUpdate }: Props) => {
    return (
        <div className="py-3 md:pb-0 font-mono tracking-tighter flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
            <div className="fixed top-3 right-3 text-gray-400" style={{fontSize: "12px"}}>
                Good flip? Feel free to <a className="text-sky-300 underline" href="https://opensea.io/yoshi_nft">tip</a>
            </div>
            <div className="fixed top-3 left-3 text-gray-400" style={{fontSize: "12px"}}>
                Created by <a className="text-sky-300 underline" href="https://twitter.com/ajwaxman">@ajwaxman</a>
            </div>
            <h1 className="text-lg text-gray-100 md:text-2xl font-bold"><span className="pr-1">🎨</span> Flipmap Palette Floor Rankings</h1>
            <div className="text-gray-100 text-center max-w-screen-md md:leading-loose">
                {/* <p className="md:text-lg mt-1">
                    Which level should you join?
                </p> */}
                <p className="text-gray-400 text-sm mv-4 mb-2">Last updated {ts(lastUpdate)}</p>
                <a href="/" className="text-[#6bc04e] text-xs mv-4 mb-5">🖼 <span className="underline">View rankings by Composition</span></a>
            </div>
            <div className="grid md:grid-cols-1 pt-2 mb-20 text-white place-content-center">
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Rank
                                            </th>
                                            <th
                                                scope="col"
                                                className="pl-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Palette
                                            </th>
                                            <th
                                                scope="col"
                                                className="pr-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Floor
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                1 Until
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                3 Until
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                5 Until
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Buy Now</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flips.map((flip, flipIndex) => (
                                            <tr key={flipIndex} className={flipIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="py-4 whitespace-nowrap text-sm text-center font-medium text-gray-500">{flipIndex + 1}</td>
                                                <td className="pr-6 pl-3 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={"flex-shrink-0 h-6 w-6 float-left"}>
                                                            <div className="h-6 w-6 float-left" style={{ background: flip.colors[0] }}></div>
                                                        </div>
                                                        <div className={"flex-shrink-0 h-6 w-6 float-left"}>
                                                            <div className="h-6 w-6 float-left" style={{ background: flip.colors[1] }}></div>
                                                        </div>
                                                        <div className={"flex-shrink-0 h-6 w-6 float-left"}>
                                                            <div className="h-6 w-6 float-left" style={{ background: flip.colors[2] }}></div>
                                                        </div>
                                                        <div className={"flex-shrink-0 h-6 w-6 float-left"}>
                                                            <div className="h-6 w-6 float-left" style={{ background: flip.colors[3] }}></div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{flip.name}</div>
                                                            {/* <div className="text-sm text-gray-500">Artist Name</div> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="pr-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">{flip.floor == 100000 ? "💎🤲" : flip.floor}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{flip.one_away == 100000 ? "💎🤲" : flip.one_away}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{flip.three_away == 100000 ? "💎🤲" : flip.three_away}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{flip.five_away == 100000 ? "💎🤲" : flip.five_away}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-right text-sm font-medium">
                                                    <a href={flip.floor == 100000 ? flip.bid_url : flip.url } target="_blank" rel="noopener noreferrer" className="text-[#6bc04e] hover:text-green-900 duration-300 transition-all">
                                                        {flip.floor == 100000 ? "Bid Now" : "Buy Now"}
                                                    </a>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full " + flip.css}>
                                                        {flip.rarity}
                                                    </span>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlipFloor