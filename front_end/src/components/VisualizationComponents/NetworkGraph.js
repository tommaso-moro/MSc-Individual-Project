import { ResponsiveNetworkCanvas } from '@nivo/network'
import { data } from '../../test_data/network_graph_test_data'

const NetworkGraph = () => {
    console.log(data)
    return (
        <div style={{"height": "100vh"}}>
            <ResponsiveNetworkCanvas
            nodes={data.nodes}
            links={data.links}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            linkDistance="distance"
            repulsivity={4}
            iterations={60}
            nodeColor={function(e){return e.color}}
            nodeBorderWidth={1}
            nodeBorderColor={{ theme: 'background' }}
            />
        </div>
    )
}
export default NetworkGraph;

