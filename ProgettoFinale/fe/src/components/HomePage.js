
import SearchSection from './SearchSection';
import Promos from './Promos';


function HomePage({ user, message }) {

    return (
        <div className='main'>
            <SearchSection user={user} message={message} />
            <Promos />
        </div>
    );
}

export default HomePage;