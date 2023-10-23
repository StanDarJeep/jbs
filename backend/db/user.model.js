const mongoose = require("mongoose");
const { UserType } = require("../constants/user.types");
const { LocationMode } = require("../constants/location.modes");

const educationSchema = new mongoose.Schema({
    school: String,
    program: String,
    level: Number,
    courses: [
        {
            type: String
        }
    ], // optional
    tags: [
        {
            type: String
        }
    ] // tutor only
})

const subjectHourlyRateSchema = new mongoose.Schema({
    course: String,
    hourlyRate: Number
})

const manualAvailabilitySchema = new mongoose.Schema({
    day: String,
    startTime: String,
    endTime: String
})

const oauthSchema = new mongoose.Schema({
    accessToken: String,
    refreshToken: String,
    expiryDate: String
})

const locationSchema = new mongoose.Schema({
    lat: Number,
    long: Number
})

const userFeedbackSchema = new mongoose.Schema({
    reviewerId: String,
    attitude: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    proficiencyWithSubject: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    organization: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    noShow: Boolean,
    late: Boolean,
    overallRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    comment: String,
    courses: [
        {
            type: String
        }
    ],
}, { timestamps: true })

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        googleId: String,
        isBanned: {
            type: Boolean,
            default: false
        },
        googleOauth: oauthSchema,
        type: {
            type: String,
            enum: Object.values(UserType)
        },
        username: String,
        password: String,
        email: String,
        displayedName: String,
        phoneNumber: String,
        education: educationSchema,
        subjectHourlyRate: [
            {
                type: subjectHourlyRateSchema
            }
        ],
        manualAvailability: [
            {
                type: manualAvailabilitySchema
            }
        ],
        locationMode: {
            type: String,
            enum: Object.values(LocationMode)
        },
        location: locationSchema,
        bio: String,
        useGoogleCalendar: {
            type: Boolean,
            default: false
        },
        userFeedback: [
            {
                type: userFeedbackSchema
            }
        ],
        overallRating: {
            type: Number,
            default: 0
        }

    })
)

module.exports = User