import { LevelInfo, fetchLevels } from './api/levels'
import { format as ts } from 'timeago.js'
import levelsData from '../data/levels.json'

export async function getStaticProps() {
    const data = await fetchLevels()
    return {
        props: {
            levels: data.levels,
            rarityFloors: data.rarityFloors,
            lastUpdate: data.lastUpdate
        },
        revalidate: 3,
    }
}

interface Props {
    levels: LevelInfo[]
    rarityFloors: Object[]
    lastUpdate: string
}

const LevelFive = ({ levels, rarityFloors, lastUpdate }: Props) => {
    return (
        <div className="py-3 md:pb-0 font-mono tracking-tighter flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
            <h1 className="text-lg text-gray-100 md:text-2xl font-bold"><span className="pr-1">🏔</span> Level Explorer</h1>
            <div className="text-gray-100 text-center max-w-screen-md md:leading-loose">
                {/* <p className="md:text-lg mt-1">
                    Which level should you join?
                </p> */}
                <p className="text-gray-400 text-sm mv-4 mb-2">Last updated {ts(lastUpdate)}</p>
            </div>
            <dl className="mt-5 mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {["🥇 Mythic","🥈 Legendary","🥉 Epic","Rare","Uncommon","Common"].map((item, index) => (
                <div
                    key={item}
                    className="relative bg-white pt-5 px-4 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                >
                    <dt>
                    {/* <div className="absolute bg-indigo-500 rounded-md p-3">
                    😛
                    </div> */}
                    <p className="ml text-sm font-medium text-gray-500 truncate">{item} Floor</p>
                    </dt>
                    <dd className="ml pb-6 flex items-baseline sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-900">{rarityFloors[index]["floor"]}</p>
                    </dd>
                </div>
                ))}
            </dl>
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Level
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Rarity
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Quantity
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Floor
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Buy Now</span>
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                {levels.map((level, levelIdx) => (
                                <tr key={levelIdx} className={levelIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{level.level}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full "+ level.css}>
                                            {level.rarity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level.floor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href={level.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 duration-300 transition-all">
                                        Buy Now
                                    </a>
                                    </td>
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

export default LevelFive