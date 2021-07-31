import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl';
import data from '../../test_data/geo_data.json'
import useSupercluster from 'use-supercluster'
import '../../index.css'
import api_calls from '../../api.js'

const Map = () => {
    // setup map
    const geo_data = data //using local json file for now as axios calls are not set up yet

    const [tag_data, set_tag_data] = useState([])
    // setup viewport
    const [viewport, setViewport] = useState({
        latitude: 51.4934, //greenwich lat
        longitude: 0.0098, //greenwich long
        width: "100vw",
        height: "100vh",
        zoom: 1 //zoom is 1 because we want to see the whole earth at first
    });
    const mapRef = useRef();

    
    const points = data["places"].map(place => ({
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
        api_calls.geo_spatial_data.get_geo_spatial_data_for_all_tags()
            .then(res => {
                for (var i = 0; i<res.length; i++) {
                    if (res[i] == "Biodiversity Loss") {
                        console.log(res[i]["Biodiversity Loss"])
                        //need to pass this data as props from parent to handle loading time and conditional rendering
                    }
                }  
            })
            .catch(err => {
                console.log("An error occurred")
            })
    }, [])


    return (
        <ReactMapGL
            {...viewport}
            maxZoom={20}
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
                                    width: `${10 + (pointCount / points.length) * 20}px`,
                                    height: `${10 + (pointCount / points.length) * 20}px`
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
                        <div className="place-point-marker"></div>
                    </Marker>
                );
            })}
        </ReactMapGL>
    );
}

export default Map;
