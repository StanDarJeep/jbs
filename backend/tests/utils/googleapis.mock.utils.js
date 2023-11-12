const MOCKED_VALUES = {
    payload: {
        sub: 'mocked-google-id',
        email: "mocked-email@testmail.com",
        name: "Edumatch Test",
    },
    tokens: {
        access_token: 'mocked-access-token',
        refresh_token: 'mocked-refresh-token',
        expiry_date: '123456789'
    }
}


let mockOAuth2 = () => {
    return {
        verifyIdToken: jest.fn(() => {
            return {
                getPayload: jest.fn(() => MOCKED_VALUES.payload)
            }
        }),
        getToken: jest.fn(() => {
            return {
                tokens: MOCKED_VALUES.tokens
            }
        })
    } 
    
}


module.exports = {
    mockOAuth2,
    MOCKED_VALUES
}