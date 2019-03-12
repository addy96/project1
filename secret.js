module.exports = {    
    database: 'mongodb://projectdb:Whatdfuck1!@localhost:27010/Database1',
    port:3000,
    secretKey: '',

    facebook: {
    	clientID: process.env.FACEBOOK || '481278068957841',
    	clientSecret: process.env.FACEBOOK_SECRET || '1854cc4f8d5e89313ac82c262b64a62e', 
    	profileFields: ['emails', 'displayName'],
    	callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}