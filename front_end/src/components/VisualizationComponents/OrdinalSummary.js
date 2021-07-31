import OrdinalFrame from "semiotic/lib/OrdinalFrame"
import testData from '../../test_data/subjectivity_scores.json'
const colors = {
  "Ex Machina": "#ac58e5",
  "Far from the Madding Crowd": "#E0488B",
  "The Longest Ride": "#9fd0cb",
  "Green/Sustainable Energy": "#ac58e5"
}



const frameProps = {   
  data: testData["data"],
  size: [700,400],
  margin: { left: 160, bottom: 90, right: 10, top: 40 },
  summaryType: "ridgeline", 
  projection: "horizontal",
  oAccessor: "group",
  rAccessor: "price",
  rExtent: [0],
  style: d => {
    return {
      r: 2,
      fill: d && colors[d.title]
    }
  },
  summaryStyle: d => ({
    fill: d && colors[d.title],
    fillOpacity: 0.2,
    stroke: d && colors[d.title],
    strokeWidth: 0.5
  }),
  title: "Box Office Movies by Rank",
  axes: [{ orient: "bottom", label: "price" }],
  oLabel: true
}

const OrdinalSummary = () => {
  return <OrdinalFrame {...frameProps} />
}

export default OrdinalSummary;