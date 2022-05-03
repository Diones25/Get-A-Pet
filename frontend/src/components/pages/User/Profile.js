import api from '../../../utils/api';
import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import formStyles from '../../form/Form.module.css';
import Input from '../../form/Input';
import useFlashMessage from '../../../hooks/useFlashMessage';
import RoundedImage from '../../layout/RoundedImage';
import userEvent from '@testing-library/user-event';

function Profile() {

    const [ user, setUser ] = useState({});
    const [ preview, setPreview ] = useState('');
    const [ token ] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage();

    useEffect(() => {
        api.get('/users/checkuser', {
            headers: {
                Autorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data)
        })

    }, [token]);

    const onFIleChange = (e) => {
        setPreview(e.target.files[0])
        setUser({...user, [e.target.name]: e.target.files[0] })
    }

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let msgType = 'success';

        const formData = new FormData();

        await Object.keys(user).forEach((key) => {
            formData.append(key, user[key])
        })

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Autorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
            return response.data

        }).catch((err) => {
            msgType = 'error';
            return err.response.data;
        })

        setFlashMessage(data.message, msgType);
    }

    return (
        <section>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                    <RoundedImage  
                        src = 
                        { preview ? URL.createObjectURL(preview) : 
                            `${process.env.REACT_APP_API}/images/users/${user.image}`
                        }
                        alt={user.name} 
                    />
                )}
            </div>
            <form onSubmit={handleSubmit} className={formStyles.form_container}>
                <Input 
                    text="Image"
                    type="file"
                    name="image"
                    handleOnchange={onFIleChange}
                />
                <Input 
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnchange={onFIleChange}
                    value={user.email || ''}
                />
                <Input 
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnchange={handleChange}
                    value={user.name || ''}
                />
                <Input 
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnchange={handleChange}
                    value={user.phone || ''} 
                />
                <Input 
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnchange={handleChange}
                />
                <Input 
                    text="Confirmação de senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnchange={handleChange}
                />
                <input type="submit" value="Editar" />
            </form>
        </section>
    )
}
 
export default Profile;