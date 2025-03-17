// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Alert } from "antd";
import { Offline, Online } from "react-detect-offline"


import App from './App.jsx'

createRoot(document.getElementById('root')).render(

    <>
        <Online>
            <App  />
        </Online>
        <Offline>
            <div className="offline">
                <Alert
                    type="error"
                    message={`Проверьте подключение к интернету`}
                />
            </div>
        </Offline>
    </>,

  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
