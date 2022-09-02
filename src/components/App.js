import '../index.css';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import {useEffect, useState} from 'react';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import {CurrentUserContext} from '../context/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import AuthForm from './AuthForm';

function App() {

    const [currentUser, setCurrentUser] = useState({
        name: 'Alex',
        about: 'me',
        avatar: 'https://placepic.ru/wp-content/uploads/2018/11/kartinkijane.ru-8304.jpg',
        _id: '1'
    });
    const [cards, setCards] = useState([]);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [isDeleteCardPopup, setIsDeleteCardPopup] = useState({
        show: false,
        card: null
    });

    useEffect(() => {
        Promise.all([api.getInitialProfileInfo(), api.getInitialCards()])
            .then(([userData, cards]) => {
                setCurrentUser(userData);
                setCards(cards);
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }, [])

    function handleUpdateUser(userInfo) {
        api.patchProfileInfo(userInfo)
            .then((userData) => {
                setCurrentUser(userData);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    function handleUpdateAvatar(avatar) {
        api.editAvatar(avatar)
            .then((userData) => {
                setCurrentUser(userData);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.pressLike({
            likeState: isLiked,
            imgID: card._id
        })
            .then((newCard) => {
                setCards((state) => state.map((oldCard) => oldCard._id === card._id ? newCard : oldCard));
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            });
    }

    function handleAddPlace(place) {
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.addNewCard(place)
            .then((newCard) => {
                setCards([newCard, ...cards]);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            });
    }

    function openProfilePopup() {
        setIsEditProfilePopupOpen(true);
    }

    function openAvatarPopup() {
        setIsEditAvatarPopupOpen(true);
    }

    function openPlacePopup() {
        setIsAddPlacePopupOpen(true);
    }

    function changeSelectedCard(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsDeleteCardPopup({
            show: false,
            card: null
        });
        setSelectedCard({});
    }

    function handleDeleteConfirm(card) {
        setIsDeleteCardPopup({
            show: true,
            card: card,
        });
    }

    const handleDeleteSubmit = (e) => {
        e.preventDefault();

        if (isDeleteCardPopup.show) {
            api.deleteCard(isDeleteCardPopup.card._id)
                .then(() => {
                    setCards((state) => state.filter((oldCard) => oldCard._id !== isDeleteCardPopup.card._id));
                })
                .catch((err) => {
                    console.log(`Ошибка: ${err}`);
                });
            setIsDeleteCardPopup({
                show: false,
                card: null,
            });
        }
    };

    useEffect(() => {
        function handleEscapeKey(evt) {
            if (evt.key === 'Escape') {
                closeAllPopups();
            }
        }

        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
    }, [])

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header/>
            <AuthForm  title="Регистрация" btnName="Зарегистрироваться"/>
            {/*<AuthForm  title="Вход" btnName="Войти"/>*/}
            {/*<Main onEditProfile={openProfilePopup}*/}
            {/*      onAddPlace={openPlacePopup}*/}
            {/*      onEditAvatar={openAvatarPopup}*/}
            {/*      onCardClick={changeSelectedCard}*/}
            {/*      cards={cards}*/}
            {/*      onCardLike={handleCardLike}*/}
            {/*      onCardDelete={handleDeleteConfirm}*/}
            {/*/>*/}
            <Footer />

            <EditProfilePopup isOpen={isEditProfilePopupOpen}
                              onClose={closeAllPopups}
                              onUpdateUser={handleUpdateUser}
            />

            <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                             onClose={closeAllPopups}
                             onUpdateAvatar={handleUpdateAvatar}
            />


            <AddPlacePopup isOpen={isAddPlacePopupOpen}
                           onClose={closeAllPopups}
                           onAddPlace={handleAddPlace}
            />


            <PopupWithForm isOpen={isDeleteCardPopup.show}
                           onClose={closeAllPopups}
                           onSubmit={handleDeleteSubmit}
                           title="Вы уверены?"
                           saveBtn="Да"
                           name="delete-card"/>

            <ImagePopup onClose={closeAllPopups} card={selectedCard}/>

        </CurrentUserContext.Provider>
    );
}

export default App;
