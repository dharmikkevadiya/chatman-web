import Chat from "../../components/Chat";
import Sidebar from "../../components/Sidebar";
import "./style.css";
import { useContext } from "react";
import { AppContext } from "../../context/Context";

const Home = () => {
  const { showSidebar } = useContext(AppContext);
  // const [fooEvents, setFooEvents] = useState([]);

  console.count("Home render");

  return (
    <main className="container">
      {showSidebar && <Sidebar />}
      <Chat />
    </main>
  );
};

export default Home;
