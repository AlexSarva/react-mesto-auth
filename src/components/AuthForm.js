import {useState} from 'react';
import {Link} from 'react-router-dom';

function AuthForm(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    return (
        <div className="auth">
            <h2 className="auth__title">{props.title}</h2>
            <form onSubmit={props.handleRegisterSubmit} className="auth__form">
                <input id="email" name="email" type="email" className="auth__input" value={email} onChange={handleChangeEmail} placeholder="Email" required minLength="2" maxLength="40"/>
                <input id="password" name="password" type="password" className="auth__input" value={password} onChange={handleChangePassword} placeholder="Пароль" required minLength="5" maxLength="40"/>
                <div className="auth__button-container">
                    <button type="submit" onSubmit={props.handleRegisterSubmit} className="auth__link">{props.btnName}</button>
                </div>
            </form>
            {props.title === 'Регистрация' &&
            <div className="auth__signin">
                <span>Уже зарегистрированы?</span>
                <Link to="login" className="auth__login-link">Войти</Link>
            </div>}
        </div>
    )
}

export default AuthForm;