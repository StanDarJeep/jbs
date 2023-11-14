const request = require('supertest');
const db = require("../../../db");
const { app } = require('../../utils/express.mock.utils');

const ENDPOINT = "/user/publicProfile"

var mockErrorMsg
var mockAddedUsers = []
var mockUnableToCreateUser = false

// ChatGPT Usage: Partial
jest.mock('../../../db', () => {
    const originalDb = jest.requireActual('../../../db')
    class MockUser extends originalDb.user {
        static findById = jest.fn()
        static findOne = jest.fn()

        static findByIdAndUpdate = jest.fn((id, data) => {
            if (mockErrorMsg) {
                return Promise.reject(new Error(mockErrorMsg))
            }
            mockAddedUsers[0] = {
                ...mockAddedUsers[0],
                ...data
            }
            return Promise.resolve(mockAddedUsers[0])
        })

        save = jest.fn(() => {
            if (mockErrorMsg) {
                return Promise.reject(new Error(mockErrorMsg))
            }
            if (mockUnableToCreateUser) {
                return Promise.resolve(undefined)
            }
            mockAddedUsers.push(this)
            return Promise.resolve(this)
        })

    }
    return {
        user: MockUser,
    }
})

beforeEach(() => {
    jest.clearAllMocks()
    mockUnableToCreateUser = false
    mockErrorMsg = undefined
    mockAddedUsers = []
})

const User = db.user

// Interface GET https://edumatch.canadacentral.cloudapp.azure.com/user/publicProfile?userId=123
describe("Get public profile", () => {
    // ChatGPT Usage: Partial
    // Input: Valid and existing userId
    // Expected status code: 200
    // Expected behavior: Calculate user's overall ratings, extract public fields
    // to return to clients
    // Expected output: User's public profile
    test("Should return public profile for a valid and existing user", async () => {
        var testReview = [
            { 
                rating: 4, 
                comment: 'Good tutor',
                reviewerId: 'reviewer1' 
            },
            { 
                rating: 5, 
                comment: 'Excellent tutor',
                reviewerId: 'reviewer2'
            },
        ]

        for (var i = 0; i < 2; i++) {
            if (i == 1) {
                testReview.push({ 
                    rating: 3, 
                    comment: 'Great tutor',
                    reviewerId: 'reviewer3'
                })
            }
            const mockUserId = 'mockUserId';
            const mockUser = {
                _id: mockUserId,
                displayedName: 'John Doe',
                userReviews: testReview,
                education: {
                    school: 'Mock School',
                    program: 'Mock Program',
                    courses: ['Course1', 'Course2'],
                    tags: ['Tag1', 'Tag2'],
                },
                bio: 'Mock bio',
                subjectHourlyRate: [
                    {
                        course: "Course1",
                        hourlyRate: 20
                    },
                    {
                        course: "Course2",
                        hourlyRate: 30
                    }
                ],
                isBanned: false
            };

            var expected = {
                displayedName: mockUser.displayedName,
                overallRating: mockGetOverallRating(mockUser.userReviews),
                bio: mockUser.bio,
                school: mockUser.education.school,
                program: mockUser.education.program,
                courses: mockUser.education.courses,
                tags: mockUser.education.tags,
                subjectHourlyRate: mockUser.subjectHourlyRate,
                top2Ratings: mockGetTop2Ratings(mockUser.userReviews)
            }
            
            User.findById.mockResolvedValueOnce(mockUser)

            const res = await request(app)
                .get(ENDPOINT)
                .query({ userId: mockUserId })

            expect(res.status).toBe(200);
            expect(res.body).toEqual(expected)
        }
    })

    // ChatGPT Usage: Partial
    // Input: Empty userId
    // Expected status code: 400
    // Expected behavior: Returns message saying userId must be specified
    // Expected output: error message
    test("Should return 400 if userId is not provided", async () => {
        const res = await request(app)
            .get(ENDPOINT)
        
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
    })

    // ChatGPT Usage: No
    // Input: userId for a banned user
    // Expected status code: 404
    // Expected behavior: Returns message saying user not found
    // Expected output: error message
    test("Should return 404 if the user is banned", async () => {
        const mockUser = {
            _id: "test-id",
            isBanned: true
        }
        User.findById.mockResolvedValueOnce(mockUser)

        const res = await request(app)
            .get(ENDPOINT)
            .query({ userId: mockUser._id })

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("message")
    })

    // ChatGPT Usage: No
    // Input: invalid userId
    // Expected status code: 500
    // Expected behavior: Catch the database error and returns error message
    // Expected output: error message
    test("Should return 500 for database error", async () => {
        const mockUserId = "invalid user id"
        const errorMessage = "Database error"
        User.findById.mockRejectedValueOnce(new Error(errorMessage))

        const res = await request(app)
            .get(ENDPOINT)
            .query({ userId: mockUserId })

        expect(res.status).toBe(500)
        expect(res.body).toEqual({ message: errorMessage })
    })

})

function mockGetOverallRating(userReviews) {
    console.log(userReviews)
    if (userReviews.length === 0) {
        return 0
    }
    var sum = 0
    for (var reviews of userReviews) {
        sum += reviews.rating
    }
    return sum/userReviews.length
}

function mockGetTop2Ratings(userReviews) {
    var ratings = userReviews
    ratings.sort((fb1, fb2) => fb2.rating - fb1.rating)

    var top2Ratings
    if (ratings.length <= 2) {
        top2Ratings = ratings
    } else {
        top2Ratings = ratings.slice(0, 3)
    }
    return top2Ratings
}