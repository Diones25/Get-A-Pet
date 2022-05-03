import api from '../../../utils/api';
import styles from './AddPet.module.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useFlashMessage from '../../../hooks/useFlashMessage';
import PetForm from '../../form/PetForm';

function AddPet() {
    const [token] = useState(localStorage.getItem('token') || '');
    const [ setFlasMessage ] = useFlashMessage();
    const history = useHistory();

    async function registerPet(pet) {
        let msgType = 'success';

        const formData = new FormData

        await Object.keys(pet).forEach((key) => {
            if(key === 'images') {
                for(let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key]);
                }
            }
            else {
                formData.append(key, pet[key]);
            }
        })
    }

    return (
      <section className={styles.addpet_header}>
        <div>
            <h1>Cadastre um Pet</h1>
            <p>Depois ele ficará disponível para adoção</p>
        </div>
        <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet"/>
      </section>
    )
  }
  
  export default AddPet
  