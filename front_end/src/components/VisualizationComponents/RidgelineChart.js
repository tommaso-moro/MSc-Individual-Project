import OrdinalFrame from "semiotic/lib/OrdinalFrame"
const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]
const frameProps = {   data: [{ k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 85 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 66 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 66 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 40 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 30 },
    { k: "Probably Not", v: 15 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 25 },
    { k: "Chances Are Slight", v: 25 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 75 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 51 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 51 },
    { k: "We Believe", v: 51 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 20 },
    { k: "Improbable", v: 49 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 49 },
    { k: "Little Chance", v: 5 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 85 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 70 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 30 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 85 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 70 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 30 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 65 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 10 },
    { k: "Improbable", v: 50 },
    { k: "Unlikely", v: 5 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 5 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 2 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 99 },
    { k: "Very Good Chance", v: 85 },
    { k: "Probable", v: 90 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 65 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 7 },
    { k: "Improbable", v: 15 },
    { k: "Unlikely", v: 8 },
    { k: "Probably Not", v: 15 },
    { k: "Little Chance", v: 5 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 3 },
    { k: "Chances Are Slight", v: 20 },
    { k: "Almost Certainly", v: 85 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 65 },
    { k: "Probable", v: 80 },
    { k: "Likely", v: 40 },
    { k: "Probably", v: 45 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 45 },
    { k: "We Doubt", v: 45 },
    { k: "Improbable", v: 35 },
    { k: "Unlikely", v: 20 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 10 },
    { k: "Highly Unlikely", v: 20 },
    { k: "Chances Are Slight", v: 30 },
    { k: "Almost Certainly", v: 97 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 75 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 30 },
    { k: "Unlikely", v: 15 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 3 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 65 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 20 },
    { k: "Improbable", v: 30 },
    { k: "Unlikely", v: 35 },
    { k: "Probably Not", v: 35 },
    { k: "Little Chance", v: 15 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 15 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 90 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 90 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 70 },
    { k: "We Believe", v: 65 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 52 },
    { k: "We Doubt", v: 60 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 30 },
    { k: "Probably Not", v: 45 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 10 },
    { k: "Highly Unlikely", v: 6 },
    { k: "Chances Are Slight", v: 25 },
    { k: "Almost Certainly", v: 90 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 85 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 60 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 1 },
    { k: "Unlikely", v: 15 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 15 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 99 },
    { k: "Highly Likely", v: 97 },
    { k: "Very Good Chance", v: 70 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 90 },
    { k: "Better Than Even", v: 67 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 17 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 17 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 3 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 60 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 70 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 60 },
    { k: "Probably", v: 55 },
    { k: "We Believe", v: 60 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 20 },
    { k: "Improbable", v: 5 },
    { k: "Unlikely", v: 30 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 88.7 },
    { k: "Highly Likely", v: 69 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 51 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 60 },
    { k: "We Believe", v: 50 },
    { k: "Better Than Even", v: 5 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 30 },
    { k: "Improbable", v: 49 },
    { k: "Unlikely", v: 20 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 13 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 3 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 99 },
    { k: "Highly Likely", v: 98 },
    { k: "Very Good Chance", v: 85 },
    { k: "Probable", v: 85 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 65 },
    { k: "We Believe", v: 5 },
    { k: "Better Than Even", v: 65 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 100 },
    { k: "Improbable", v: 1 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 100 },
    { k: "Little Chance", v: 100 },
    { k: "Almost No Chance", v: 95 },
    { k: "Highly Unlikely", v: 90 },
    { k: "Chances Are Slight", v: 35 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 85 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 30 },
    { k: "Improbable", v: 40 },
    { k: "Unlikely", v: 30 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 15 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 97 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 70 },
    { k: "Probable", v: 51 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 60 },
    { k: "We Believe", v: 75 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 5 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 15 },
    { k: "Probably Not", v: 10 },
    { k: "Little Chance", v: 15 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 7 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 99 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 60 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 3 },
    { k: "Unlikely", v: 15 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 40 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 90 },
    { k: "Probable", v: 60 },
    { k: "Likely", v: 80 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 75 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 25 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 80 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 50 },
    { k: "Better Than Even", v: 50.1 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 49.9 },
    { k: "Little Chance", v: 25 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 90 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 80 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 60 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 40 },
    { k: "Improbable", v: 30 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 92 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 60 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 60 },
    { k: "We Believe", v: 85 },
    { k: "Better Than Even", v: 57 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 33 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 10 },
    { k: "Little Chance", v: 7 },
    { k: "Almost No Chance", v: 3 },
    { k: "Highly Unlikely", v: 3 },
    { k: "Chances Are Slight", v: 13 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 80 },
    { k: "Likely", v: 85 },
    { k: "Probably", v: 85 },
    { k: "We Believe", v: 85 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 49 },
    { k: "We Doubt", v: 5 },
    { k: "Improbable", v: 15 },
    { k: "Unlikely", v: 2 },
    { k: "Probably Not", v: 10 },
    { k: "Little Chance", v: 2 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 92 },
    { k: "Very Good Chance", v: 91 },
    { k: "Probable", v: 85 },
    { k: "Likely", v: 85 },
    { k: "Probably", v: 85 },
    { k: "We Believe", v: 70 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 30 },
    { k: "Improbable", v: 7 },
    { k: "Unlikely", v: 18 },
    { k: "Probably Not", v: 27 },
    { k: "Little Chance", v: 17 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 3 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 90 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 12 },
    { k: "Improbable", v: 25 },
    { k: "Unlikely", v: 35 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 20 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 50 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 33 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 60 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 60 },
    { k: "We Believe", v: 60 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 10 },
    { k: "Improbable", v: 49 },
    { k: "Unlikely", v: 20 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 15 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 20 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 85 },
    { k: "Likely", v: 90 },
    { k: "Probably", v: 85 },
    { k: "We Believe", v: 75 },
    { k: "Better Than Even", v: 98 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 40 },
    { k: "Improbable", v: 7 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 85 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 90 },
    { k: "Probable", v: 60 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 76 },
    { k: "We Believe", v: 50 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 33 },
    { k: "Improbable", v: 25 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 15 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 80 },
    { k: "Highly Likely", v: 15 },
    { k: "Very Good Chance", v: 74 },
    { k: "Probable", v: 65 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 65 },
    { k: "We Believe", v: 60 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 38 },
    { k: "Improbable", v: 29 },
    { k: "Unlikely", v: 36 },
    { k: "Probably Not", v: 34 },
    { k: "Little Chance", v: 29 },
    { k: "Almost No Chance", v: 7 },
    { k: "Highly Unlikely", v: 15 },
    { k: "Chances Are Slight", v: 30 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 65 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 55 },
    { k: "We Believe", v: 60 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 12 },
    { k: "Probably Not", v: 35 },
    { k: "Little Chance", v: 15 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 8 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 96 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 90 },
    { k: "We Believe", v: 80 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 5 },
    { k: "Improbable", v: 9 },
    { k: "Unlikely", v: 3 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 10 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 12 },
    { k: "Almost Certainly", v: 99 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 80 },
    { k: "Likely", v: 75 },
    { k: "Probably", v: 90 },
    { k: "We Believe", v: 50 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 1 },
    { k: "Improbable", v: 0.001 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 10 },
    { k: "Little Chance", v: 5 },
    { k: "Almost No Chance", v: 0.05 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 85 },
    { k: "Highly Likely", v: 84 },
    { k: "Very Good Chance", v: 87 },
    { k: "Probable", v: 50 },
    { k: "Likely", v: 60 },
    { k: "Probably", v: 65 },
    { k: "We Believe", v: 50 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 60 },
    { k: "Improbable", v: 3 },
    { k: "Unlikely", v: 24 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 20 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 15 },
    { k: "Chances Are Slight", v: 30 },
    { k: "Almost Certainly", v: 90 },
    { k: "Highly Likely", v: 95 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 90 },
    { k: "Probably", v: 60 },
    { k: "We Believe", v: 60 },
    { k: "Better Than Even", v: 80 },
    { k: "About Even", v: 40 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 3 },
    { k: "Unlikely", v: 5 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 4 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 2 },
    { k: "Chances Are Slight", v: 30 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 85 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 64 },
    { k: "Likely", v: 80 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 75 },
    { k: "Better Than Even", v: 80 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 10 },
    { k: "Improbable", v: 10 },
    { k: "Unlikely", v: 25 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 8 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 96 },
    { k: "Very Good Chance", v: 90 },
    { k: "Probable", v: 90 },
    { k: "Likely", v: 90 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 70 },
    { k: "Better Than Even", v: 53 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 40 },
    { k: "Improbable", v: 4 },
    { k: "Unlikely", v: 30 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 8 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 98 },
    { k: "Highly Likely", v: 96 },
    { k: "Very Good Chance", v: 82 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 86 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 45 },
    { k: "Better Than Even", v: 69 },
    { k: "About Even", v: 52 },
    { k: "We Doubt", v: 21 },
    { k: "Improbable", v: 12 },
    { k: "Unlikely", v: 34 },
    { k: "Probably Not", v: 26 },
    { k: "Little Chance", v: 18 },
    { k: "Almost No Chance", v: 7 },
    { k: "Highly Unlikely", v: 3 },
    { k: "Chances Are Slight", v: 13 },
    { k: "Almost Certainly", v: 80 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 70 },
    { k: "Probable", v: 80 },
    { k: "Likely", v: 80 },
    { k: "Probably", v: 80 },
    { k: "We Believe", v: 70 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 10 },
    { k: "Improbable", v: 0 },
    { k: "Unlikely", v: 20 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 90 },
    { k: "Probable", v: 80 },
    { k: "Likely", v: 90 },
    { k: "Probably", v: 90 },
    { k: "We Believe", v: 85 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 48 },
    { k: "We Doubt", v: 15 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 35 },
    { k: "Probably Not", v: 15 },
    { k: "Little Chance", v: 15 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 8 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 99 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 90 },
    { k: "Likely", v: 60 },
    { k: "Probably", v: 50 },
    { k: "We Believe", v: 90 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 40 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 5 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 30 },
    { k: "Chances Are Slight", v: 15 },
    { k: "Almost Certainly", v: 85 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 70 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 70 },
    { k: "We Believe", v: 65 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 45 },
    { k: "We Doubt", v: 30 },
    { k: "Improbable", v: 15 },
    { k: "Unlikely", v: 35 },
    { k: "Probably Not", v: 30 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 15 },
    { k: "Chances Are Slight", v: 20 },
    { k: "Almost Certainly", v: 90 },
    { k: "Highly Likely", v: 70 },
    { k: "Very Good Chance", v: 80 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 65 },
    { k: "We Believe", v: 70 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 15 },
    { k: "Improbable", v: 35 },
    { k: "Unlikely", v: 20 },
    { k: "Probably Not", v: 25 },
    { k: "Little Chance", v: 5 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 90 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 70 },
    { k: "Probably", v: 75 },
    { k: "We Believe", v: 100 },
    { k: "Better Than Even", v: 60 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 10 },
    { k: "Improbable", v: 5 },
    { k: "Unlikely", v: 10 },
    { k: "Probably Not", v: 20 },
    { k: "Little Chance", v: 10 },
    { k: "Almost No Chance", v: 1 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 5 },
    { k: "Almost Certainly", v: 85 },
    { k: "Highly Likely", v: 90 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 65 },
    { k: "Likely", v: 65 },
    { k: "Probably", v: 60 },
    { k: "We Believe", v: 95 },
    { k: "Better Than Even", v: 55 },
    { k: "About Even", v: 50 },
    { k: "We Doubt", v: 95 },
    { k: "Improbable", v: 5 },
    { k: "Unlikely", v: 20 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 25 },
    { k: "Almost No Chance", v: 2 },
    { k: "Highly Unlikely", v: 5 },
    { k: "Chances Are Slight", v: 10 },
    { k: "Almost Certainly", v: 95 },
    { k: "Highly Likely", v: 80 },
    { k: "Very Good Chance", v: 75 },
    { k: "Probable", v: 75 },
    { k: "Likely", v: 60 },
    { k: "Probably", v: 68 },
    { k: "We Believe", v: 55 },
    { k: "Better Than Even", v: 51 },
    { k: "About Even", v: 49 },
    { k: "We Doubt", v: 25 },
    { k: "Improbable", v: 20 },
    { k: "Unlikely", v: 35 },
    { k: "Probably Not", v: 40 },
    { k: "Little Chance", v: 17 },
    { k: "Almost No Chance", v: 5 },
    { k: "Highly Unlikely", v: 10 },
    { k: "Chances Are Slight", v: 15 }],
  size: [900,690],
  margin: { left: 150, top: 50, bottom: 75, right: 15 },
  summaryType: { type: "ridgeline", bins: 10, amplitude: 50, curve: "monotonex" },
  projection: "horizontal",
  oAccessor: "k",
  rAccessor: "v",
  summaryStyle: (d, i) => ({
    fill: theme[i % theme.length],
    stroke: "black",
    strokeWidth: 2,
    fillOpacity: 0.5,
    strokeOpacity: 0.25
  }),
  title: "Subjectivity Scores",
  axes: [{ orient: "bottom", label: "Count of Probability by Phrase", tickFormat: function(e){return e+"%"} }],
  summaryHoverAnnotation: true,
  oLabel: d => (
    <text style={{ textAnchor: "end", fill: "grey" }} x={-10} y={5}>
      {d}
    </text>
  )
}

const Ridgeline = () => {
  return <OrdinalFrame {...frameProps} />
}
export default Ridgeline