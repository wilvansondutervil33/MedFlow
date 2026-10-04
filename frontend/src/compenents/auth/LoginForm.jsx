import { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';


function LoginForm (){
    const {login} = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null);
        try{
            await login(username, password);
        } catch (e){
            if (e.response?.status === 401){
                setError('Incorrect Username or password')
            }else{
                setError('Something when wrong')
                console.log(e)
            }
        }

    };

    const handleDemo = async (e) => {
        e.preventDefault()
        setError(null)
        setUsername('demo')
        setPassword('DemoPass123!')
        try{
            await login(username, password);
        } catch (e){
            setError(e.response?.data)
        }
    }

    return(
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
            <Paper component='form' onSubmit={handleSubmit} variant='outline' sx={{p:4, width: 320}}>
                <Typography variant='h6' gutterBottom>
                    MedFlow Login
                </Typography>
                {error && <Alert severity='error' sx={{mb:2}}>{error}</Alert>}
                <TextField
                    label= 'Username'
                    fullWidth
                    margin='normal'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                <TextField
                    label= 'Password'
                    type='password'
                    fullWidth
                    margin='normal'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                <Button type='submit' variant='contained' fullWidth sx={{mt:2}}>
                    Log-In
                </Button>
                <Button type='submit' onClick={()=> {setUsername('demo'),setPassword('DemoPass123!')}} variant='contained' fullWidth sx={{mt:2}}>
                    Demo
                </Button>
            </Paper>

        </Box>
    )
}

export default LoginForm;