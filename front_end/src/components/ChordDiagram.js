import { ResponsiveChordCanvas } from '@nivo/chord'
import { data } from '../test_data/chord_test_data';

const Chord = () => {
    return (
        <div style={{"height": "100vh"}}>
            <ResponsiveChordCanvas
            matrix={data}
            keys={[
                'John',
                'Raoul',
                'Jane',
                'Marcel',
                'Ibrahim',
                'Junko',
                'Lyu',
                'André',
                'Maki',
                'Véronique',
                'Thibeau',
                'Josiane',
                'Raphaël',
                'Mathéo',
                'Margot',
                'Hugo',
                'Christian',
                'Louis',
                'Ella',
                'Alton',
                'Jimmy',
                'Guillaume',
                'Sébastien',
                'Alfred',
                'Bon',
                'Solange',
                'Kendrick',
                'Jared',
                'Satoko',
                'Tomoko',
                'Line',
                'Delphine',
                'Leonard',
                'Alphonse',
                'Lisa',
                'Bart',
                'Benjamin',
                'Homer'
            ]}
            margin={{ top: 60, right: 200, bottom: 60, left: 60 }}
            valueFormat=".2f"
            pixelRatio={2}
            padAngle={0.006}
            innerRadiusRatio={0.86}
            innerRadiusOffset={0}
            arcOpacity={1}
            arcBorderWidth={0}
            arcBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
            ribbonOpacity={0.5}
            ribbonBorderWidth={0}
            ribbonBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
            enableLabel={true}
            label="id"
            labelOffset={9}
            labelRotation={-90}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
            colors={{ scheme: 'paired' }}
            isInteractive={true}
            arcHoverOpacity={1}
            arcHoverOthersOpacity={0.4}
            ribbonHoverOpacity={0.75}
            ribbonHoverOthersOpacity={0}
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemWidth: 80,
                    itemHeight: 11,
                    itemsSpacing: 0,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    symbolSize: 12,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
            />
        </div>
    )
}
export default Chord;