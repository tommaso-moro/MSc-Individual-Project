import { ResponsiveSwarmPlotCanvas } from '@nivo/swarmplot'
import data from '../../test_data/subjectivity_scores.json'

const subjectivity_scores_data = data["data"]

const SwarmPlotCanvas = ({ data /* see data tab */ }) => (
    <ResponsiveSwarmPlotCanvas
        data={subjectivity_scores_data}
        groups={[ 'Green/Sustainable Energy']}
        identity="id"
        value="price"
        valueFormat="$.2f"
        valueScale={{ type: 'linear', min: 0, max: 1, reverse: false }}
        spacing={1}
        simulationIterations={60}
        colors={{ scheme: 'paired' }}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.6 ] ] }}
        margin={{ top: 80, right: 100, bottom: 100, left: 100 }}
        axisTop={{
            orient: 'top',
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Subjectivity scores',
            legendPosition: 'middle',
            legendOffset: -46
        }}
        axisRight={{
            orient: 'right',
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 76
        }}
        axisBottom={{
            orient: 'bottom',
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 46
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -76
        }}
        useMesh={true}
    />
)

export default SwarmPlotCanvas;