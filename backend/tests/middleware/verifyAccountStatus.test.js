const db = require("../../db")
const { account } = require("../../middleware")
const { initReqResMock } = require("../utils/express.mock.utils")

jest.mock('../../db')

describe("Verify account status", () => {
    test("Verify an existing and unbanned user", async () => {
        var userId = Math.random().toString(36).substring(12)
        const mockUser = {
            _id: userId,
            isBanned: false
        }

        // Mock the behavior of User.findById
        db.user.findById.mockResolvedValue(mockUser);
        var {req, res, resSendMock} = initReqResMock()
        var next = jest.fn()

        req.userId = userId

        await account.verifyAccountStatus(req, res, next)

        expect(db.user.findById).toHaveBeenCalledWith(userId);
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    })

    test("Return 403 for a banned user", async () => {
        var userId = Math.random().toString(36).substring(12)
        const mockUser = {
            _id: userId,
            isBanned: true
        }

        db.user.findById.mockResolvedValue(mockUser);
        var {req, res, resSendMock} = initReqResMock()
        var next = jest.fn()

        req.userId = userId

        await account.verifyAccountStatus(req, res, next)

        expect(db.user.findById).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(resSendMock).toHaveBeenCalledWith({
            message: 'User is not found or banned',
        });
    })

    test("Return 403 for nonexisting user", async () => {
        var userId = Math.random().toString(36).substring(12)
        db.user.findById.mockResolvedValue(undefined);

        var {req, res, resSendMock} = initReqResMock()
        var next = jest.fn()

        req.userId = userId

        await account.verifyAccountStatus(req, res, next)

        expect(db.user.findById).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(resSendMock).toHaveBeenCalledWith({
            message: 'User is not found or banned',
        });
        expect(next).not.toHaveBeenCalled();
    })

    test("Return 500 for an error during user lookup", async () => {
        var userId = Math.random().toString(36).substring(12)
        const errorMessage = 'Database error';
        db.user.findById.mockRejectedValue(new Error(errorMessage));

        var {req, res, resSendMock} = initReqResMock()
        var next = jest.fn()
        req.userId = userId

        await account.verifyAccountStatus(req, res, next)
            .catch(err => {
                expect(db.user.findById).toHaveBeenCalledWith(userId);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(sendMock).toHaveBeenCalledWith({ message: errorMessage });
                expect(next).not.toHaveBeenCalled();
            })
    })
})