import './App.css'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from './store'
import { muiTheme } from './theme/muiTheme'
import Header from './components/common/header/header'

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div>
          <Header/>
        </div>
      </ThemeProvider>
    </Provider>
  )
}

export default App
