import User from "../models/user.model.js";

export const signUp = async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: (arg0: unknown) => void) => {
    try {
        const { email, password } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }


        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
        return;

    } catch (error) {
        next(error);
    }
}

export const signIn = async (req: { body: { email: any; password: any; }; }, res: any, next: any) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const existingUser = await User.find
    } catch (error) {
        next(error);
    }
}


export const signOut = async (req: any, res: { clearCookie: (arg0: string) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: (arg0: unknown) => void) => {
    try {
        // Clear the cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'User signed out successfully' });
        return;
    } catch (error) {
        next(error);
    }
}