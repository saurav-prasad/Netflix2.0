import { useEffect, useState } from 'react';
import './App.css';
import Banner from './components/banner/Banner';
import Nav from './components/nav/Nav';
import Row from './components/rows/Row';
import requests from './requests';
import Alrt from './components/alrt/Alrt';
import Footer from './components/footer/Footer';
import VideoDetail from './components/videoDetail/VideoDetail';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import VideoListing from './components/videoListing/VideoListing';
import { useUserDataState } from './context/userDataContext/UserDataState';
import { backend } from './axios';
import Signup from './components/signup/Signup';
import Search from './components/search/Search';

function App() {
  const [alert, setAlert] = useState(null);
  const [alertText, setAlertText] = useState();
  const showAlert = (data) => {
    setAlert(data)
    setTimeout(() => {
      setAlert(null);
    }, 1000)
  }
  const [user, dispatch] = useUserDataState()

  useEffect(() => {
    async function fetchData() {
      try {
        if (localStorage.getItem('auth-token')) {
          // console.log("object");
          const authToken = localStorage.getItem('auth-token')
          //user
          const userData = await backend.get('/auth/fetchuser', {
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            }
          })
          // history
          const historyData = await backend.get('/history/fetchhistory',
            {
              headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken,
              }
            }
          )
          const a = historyData.data.data?.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
          a.reverse()

          // wishlist
          const wishListData = await backend.get('/wishlist/fetchwishlist',
            {
              headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken,
              }
            }
          )
          const b = wishListData.data.data?.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
          b.reverse()


          dispatch({
            ...user,
            type: 'Set_User',
            user: userData.data.user,
            history: a,
            wishList: b,
          })
        }
      } catch (err) { console.log(err); }
    }
    fetchData()
  }, [])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <>
        <Nav />
        <Banner setAlertText={setAlertText} showAlert={showAlert} />
        <div className='pt-2 pb-16'>
          <Row setAlertText={setAlertText} showAlert={showAlert} isLargeRow={true} title='Netflix Originals' fetchUrl={requests.fetchNetflixOriginals} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Trending Now' fetchUrl={requests.fetchNetflixOriginals} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Top Rated' fetchUrl={requests.fetchTopRated} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Action' fetchUrl={requests.fetchActionMovies} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Comedy' fetchUrl={requests.fetchComedyMovies} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Horror' fetchUrl={requests.fetchHorrorMovies} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Romance' fetchUrl={requests.fetchRomanceMovies} />
          <Row setAlertText={setAlertText} showAlert={showAlert} title='Documentaries' fetchUrl={requests.fetchDocumentaries} />
        </div>
        <Footer />
      </>
    },
    {
      path: '/video/:movieid/:trailerid',
      element: <>
        <VideoDetail setAlertText={setAlertText} showAlert={showAlert} />
        <Footer />
      </>
    },
    {
      path: '/history',
      element: <>
        <Nav showBackButton={true} />
        <VideoListing setAlertText={setAlertText} showAlert={showAlert} />
        <Footer />
      </>
    },
    {
      path: '/wishlist',
      element: <>
        <Nav showBackButton={true} />
        <VideoListing setAlertText={setAlertText} showAlert={showAlert} />
        <Footer />
      </>
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/signin',
      element: <Signup />
    },
    {
      path: '/search',
      element: <>
        <Nav showBackButton={true} />
        <Search setAlertText={setAlertText} showAlert={showAlert} />
        <Footer />
      </>
    }
  ])
  return (
    <div className='App'>
      <Alrt alertText={alertText} showAlert={alert} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
