
import SearchSection from './SearchSection';
import Promos from './Promos';


function HomePage({ user }) {

    return (
        <div className='main'>
            <SearchSection user={user} />
            <Promos />
        </div>
    );
}

export default HomePage;