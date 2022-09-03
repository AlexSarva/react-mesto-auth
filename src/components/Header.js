import {Link} from 'react-router-dom';

function Header(props) {

    function renderSwitch(state) {
        switch (state) {
            case 'login':
                return (
                    <Link to="/sign-in" className="header__auth-link">Войти</Link>
                );
            case 'register':
                return (
                    <Link to="/sign-up" className="header__auth-link">Регистрация</Link>
                );
            default:
                return (
                    <>
                        <p className="header__username">{props.userName}</p>
                        <button type="button" onClick={props.onLogout} className="header__exit-btn"
                                value="Выйти" name="exit-btn">Выйти
                        </button>
                    </>
                )

        }
    }

    return (
        <header className="header">
            <div className="header__logo"></div>
            <div className="header__status-container">
                {renderSwitch(props.authState)}
            </div>
        </header>
    )
}

export default Header;