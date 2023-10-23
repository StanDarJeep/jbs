const db = require("../db")

const User = db.user

exports.getTutorOverallRatingPerOneReivew = (userFeedback) => {
    const numCriteria = 3
    return (
        userFeedback.attitude + 
        userFeedback.proficiencyWithSubject + 
        userFeedback.organization
    )/numCriteria
}

exports.getTutorOverallRating = (ratingList) => {
    var sum = 0
    for (rating of ratingList) {
        sum += rating.overallRating
    }
    return sum/ratingList.length
}