import { useState } from 'react';
import formStyles from './Form.module.css';
import Input from './Input';
import Select from './Select';

function PetForm({ handleSubmit, petData, btnText }) {
    const [ pet, setPet ] = useState(petData || {});
    const [ preview, setPreview ] = useState([]);
    const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"]

    const onFileChange = (e) => {
        setPreview(Array.from(e.target.files))
        setPet({...pet, images: [...e.target.files]})
    }

    const handleChange = (e) => {
        setPet({...pet, [e.target.name]: e.target.value})
    }

    const handleColor = (e) => {
        setPet({...pet, color: e.target.options[e.target.selectedIndex].text})
    }

    const submit = (e) => {
        e.preventDefault()
        console.log(pet)
        handleSubmit(pet)
    }

    return (
      <section>
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_pet_images}>
                {preview.length > 0 
                    ? 
                    preview.map((image, index) => (
                        <img 
                            src={URL.createObjectURL(image)} 
                            alt={pet.name} 
                            key={`${pet.name} + ${index}`} 
                        />
                    ))
                    :
                    pet.images && 
                    pet.images.map((image, index) => (
                        <img 
                            src={`${process.env.REACT_APP_API}/images/pets/${image}`} 
                            alt={pet.name} 
                            key={`${pet.name} + ${index}`} 
                        />
                    ))
                }
            </div>
            <Input 
                text="Imagem do Pet"
                type="file"
                name="images"
                handleOnchange={onFileChange}
                multiple={true}
            />
            <Input 
                text="Nome do Pet"
                type="text"
                name="name"
                handleOnchange={handleChange}
                placeholder="Digite o nome"
                value={pet.name || ''}
            />
            <Input 
                text="Idade do Pet"
                type="text"
                name="age"
                handleOnchange={handleChange}
                placeholder="Digite a idade"
                value={pet.age || ''}
            />
            <Input 
                text="Peso do Pet"
                type="number"
                name="weight"
                handleOnchange={handleChange}
                placeholder="Digite o peso"
                value={pet.weight || ''}
            />
            <Select 
                name="color"
                text="Selecione a cor"
                options={colors}
                handleOnchange={handleColor}
                value={pet.color || ''}
            />
            <input type="submit" value={btnText}/>
            
        </form>
      </section>
    )
  }
  
  export default  PetForm;
  