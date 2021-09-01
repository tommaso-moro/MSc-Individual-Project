import React, { useState, useRef, useEffect } from 'react';

import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

import useSupercluster from 'use-supercluster' //this library allows for the use of clusters, useful when rendering many data points
import '../../index.css'

import { PushpinTwoTone } from'@ant-design/icons';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;


/* NB: while mapbox works in development, it causes issues in the build: "An error occurred while parsing the WebWorker bundle. This is most likely due to improper transpilation by Babel" 
and the map does not display correctly. Following zanemountcastle's
comment here the issue has been solved: https://github.com/visgl/react-map-gl/issues/1266

in short:
- install worker-loader https://www.npmjs.com/package/worker-loader
- add 'import mapboxgl from "mapbox-gl";' to the imports
- add 'mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;'
*/


const Map = (props) => {
    // setup viewport
    const [viewport, setViewport] = useState({
        latitude: 51.4934, //greenwich lat
        longitude: 0.0098, //greenwich long
        width: props.width,
        height: "80vh",
        zoom: 1 //zoom is 1 because we want to see the whole earth at first
    });
    const mapRef = useRef();

    
    const points = props.data.map(place => ({
        type: "Feature",
        properties: { cluster: false, placeId: place.id, category: place.place_type },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(place.centroid[0]),
                parseFloat(place.centroid[1])
            ]
        }
    }));

    //get map bounds
    const bounds = mapRef.current
        ? mapRef.current
            .getMap()
            .getBounds()
            .toArray()
            .flat()
        : null;

    // get clusters
    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom: viewport.zoom,
        options: { radius: 55, maxZoom: 20 } //radius and maxZoom can be edited to change clusters' behavior
    });



    useEffect(() => {
        
    }, [])


    return (
        <ReactMapGL
            {...viewport}
            maxZoom={12}
            mapStyle="mapbox://styles/tomms/ckrggduns4pem17o9cin0pkh9" //give user option to use dark or light theme (or bubblegum etc)
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onViewportChange={newViewport => {
                setViewport({ ...newViewport });
            }}
            ref={mapRef}
        >
            {clusters.map(cluster => {
                // every cluster point has coordinates
                const [longitude, latitude] = cluster.geometry.coordinates;

                // the point may be either a cluster or a non-cluster place-point
                const {
                    cluster: isCluster,
                    point_count: pointCount
                } = cluster.properties;

                // if it is a cluster
                if (isCluster) {
                    return (
                        //render cluster
                        <Marker
                            key={`cluster-${cluster.id}`}
                            latitude={latitude}
                            longitude={longitude}
                        >
                            <div
                                className="cluster-marker"
                                style={{ //cluster size is proportional to the number of points it contains
                                    width: `${10 + (pointCount / points.length) * 85}px`,
                                    height: `${10 + (pointCount / points.length) * 85}px`
                                }}
                                onClick={() => { //zoom in when cluster is clicked
                                    const expansionZoom = Math.min(
                                        supercluster.getClusterExpansionZoom(cluster.id),
                                        20
                                    );

                                    setViewport({
                                        ...viewport,
                                        latitude,
                                        longitude,
                                        zoom: expansionZoom,
                                        transitionInterpolator: new FlyToInterpolator({
                                            speed: 2
                                        }),
                                        transitionDuration: "auto"
                                    });
                                }}
                            >
                                {pointCount} 
                            </div>
                        </Marker>
                    );
                }

                // if the point is not a cluster (i.e. it is an individual place-point)
                return (
                    <Marker
                        key={`place-${cluster.properties.placeId}`}
                        latitude={latitude}
                        longitude={longitude}
                    >
                        <PushpinTwoTone/>
                    </Marker>
                );
            })}
        </ReactMapGL>
    );
}

export default Map;
