const Pet = require('../models/Pet');

//helper
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const { Types } = require('mongoose');
const { use } = require('bcrypt/promises');
const ObjectId = Types.ObjectId;

module.exports = class PetController {

    //create pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const available = true;
        const images = req.files;
        
        //upload de imagem


        //validações
        if(!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
        }
        if(!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
        }
        if(!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
        }
        if(!color) {
            res.status(422).json({ message: "O cor é obrigatória!" });
        }
        if(images.length === 0) {
            res.status(422).json({ message: "A imagem é obrigatória!" });
        }

        console.log(images)

        //pegando dono do pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        //criando um pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image) => {
            pet.images.push(image.filename) 
        });

        try {

            const petExist = await Pet.findOne({ name: name });
            if(petExist) {
                res.status(422).json({ message: "O pet já está cadastrado!" });
            }
            else {
                const newPet = await pet.save();
                res.status(201).json({
                    message: "Pet cadastrado com sucesso!",
                    newPet
                })
            }

        }catch(error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt');

        res.status(200).json({ pets: pets })
    }

    static async getAllUserPets(req, res) {
        //get user frpm token
        const token = getToken(req);
        const user = await getUserByToken(token);
        
        const pets = await Pet.find({ 'user._id' : user._id }).sort('-createdAt');

        res.status(200).json({ pets: pets });
    }

    static async getAllUserAdoptions(req, res) {
        //get user frpm token
        const token = getToken(req);
        const user = await getUserByToken(token);
        
        const pets = await Pet.find({ 'adopter._id' : user._id }).sort('-createdAt');

        res.status(200).json({ pets: pets });
    }

    static async getPetById(req, res) {
        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id inválido' });
            return;
        }

        //checando se o Pet existe
        const pet = await Pet.findOne({ _id: id });

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        res.status(200).json({ pet: pet});
    }

    static async removePetById(req, res) {
        const id = req.params.id;

        //Verificando se o id é inválido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id inválido' });
            return;
        }

        //checando se o Pet existe
        const pet = await Pet.findOne({ _id: id });

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        //verificando se o usuário logado registrou o pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!' });
            return;
        }

        await Pet.findByIdAndRemove(id);
        res.status(200).json({ message: 'Pet removido com sucesso' });
    }

    static async updatePet(req, res) {
        const id = req.params.id;
        const { name, age, weight, color, available } = req.body;
        const images = req.files;

        const updateData = {}

        //checando se o Pet existe
        const pet = await Pet.findOne({ _id: id });

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        //verificando se o usuário logado registrou o pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!' });
            return;
        }

        //validações
        if(!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
        }
        else {
            updateData.name = name;
        }

        if(!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
        }
        else {
            updateData.age = age;
        }

        if(!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
        }
        else {
            updateData.weight = weight;
        }

        if(!color) {
            res.status(422).json({ message: "O cor é obrigatória!" });
        }
        else {
            updateData.color = color;
        }

        if(images.length === 0) {
            res.status(422).json({ message: "A imagem é obrigatória!" });
        }
        else {
            updateData.images = [];
            images.map((image) => {
                updateData.images.push(image.filename);
            });
        }

        await Pet.findByIdAndUpdate(id, updateData);
        res.status(200).json({ message: "Pet atualizado com sucesso" });
    }

    static async schedule(req, res) {
        const id = req.params.id;

        //checando se o Pet existe
        const pet = await Pet.findOne({ _id: id });

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        //verificando se o usuário logado registrou o pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode agendar uma visita com o seu própio Pet!' });
            return;
        }

        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita para esse Pet!' });
                return;
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}` });
    }

    static async concludeAdoption(req, res) {
        const id  = req.params.id;

        //checando se o Pet existe
        const pet = await Pet.findOne({ _id: id });

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        //verificando se o usuário logado registrou o pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!' });
            return;
        }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({ message: 'Parabéns o ciclo de adoção foi finalizado com sucesso!' });
        return;
    }
} 