import { useEffect, useState } from 'react';
import './App.css';
import './App.css'
import Banner from './components/banner/Banner';
import Nav from './components/nav/Nav';
import Row from './components/rows/Row';
import requests from './requests';
import Alrt from './components/alrt/Alrt';
import Footer from './components/footer/Footer';
import VideoDetail from './components/videoDetail/VideoDetail';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import VideoListing from './components/history/VideoListing';
import { useUserDataState } from './context/userDataContext/UserDataState';
import { backend } from './axios';
import Signup from './components/signup/Signup';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (data) => {
    setAlert(data)
    setTimeout(() => {
      setAlert(null);
    }, 1000)
  }
  const [user, dispatch] = useUserDataState()
  useEffect(() => {
    async function fetchData() {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjY1M2U3NDcwNGRjZmY3ZTczY2NjYzkwNyJ9LCJpYXQiOjE2OTg1OTMxMDh9.Nr-iRzNaBbVjh8SH1qK9cBF_Zbo3s6OZwYApTTwroWA'
      // if (localStorage.getItem('auth-token')) {
      if (authToken) {
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
    }
    fetchData()
  }, [])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <>
        <Nav />
        <Banner showAlert={showAlert} />
        <Row showAlert={showAlert} isLargeRow={true} title='Netflix Originals' fetchUrl={requests.fetchNetflixOriginals} />
        <Row showAlert={showAlert} title='Trending Now' fetchUrl={requests.fetchNetflixOriginals} />
        <Row showAlert={showAlert} title='Top Rated' fetchUrl={requests.fetchTopRated} />
        <Row showAlert={showAlert} title='Action' fetchUrl={requests.fetchActionMovies} />
        <Row showAlert={showAlert} title='Comedy' fetchUrl={requests.fetchComedyMovies} />
        <Row showAlert={showAlert} title='Horror' fetchUrl={requests.fetchHorrorMovies} />
        <Row showAlert={showAlert} title='Romance' fetchUrl={requests.fetchRomanceMovies} />
        <Row showAlert={showAlert} title='Documentaries' fetchUrl={requests.fetchDocumentaries} />
      </>
    },
    {
      path: '/video/:id',
      element: <>
        <VideoDetail showAlert={showAlert} />
      </>
    },
    {
      path: '/history',
      element: <VideoListing />
    },
    {
      path: '/wishlist',
      element: <VideoListing />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/signin',
      element: <Signup />
    }
  ])
  return (
    <div className='App'>
      <Alrt showAlert={alert} />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
