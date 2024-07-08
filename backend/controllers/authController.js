import { OAuth2Client } from 'google-auth-library';
import { 
  findUserByGoogleId,
   createUser,
   generateUserToken,
  getUserById,
  getUserByEmail,
  getUserPictureAndNameByEmail,
 } from '../repositories/authRepository.js';
import dotenv from 'dotenv'

dotenv.config()

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;  
const client = new OAuth2Client(CLIENT_ID);

export const authenticate = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: google_id, email, name, picture } = payload;

    let user = await findUserByGoogleId(google_id);
    
    if (!user) {
      const userId = await createUser(google_id, email, name, picture);
      user = { id: userId, name, email, picture_link: picture };
    }

    const userToken = await generateUserToken(user.id, google_id, email);
    
   res.cookie('token', userToken, {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 3600000 
});


    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture_link || picture,
      },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const _getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

export const  _getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

export const _getUserNameAndPictureById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

export const  _getUserNameAndPictureByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await getUserPictureAndNameByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};