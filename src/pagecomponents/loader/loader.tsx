import style from './loader.module.scss'; // Adjust the path based on your folder structure

const Loader: React.FC = () => {
    return (
        <div className={style.allElement}>
        <div className={style.loader}></div>
        </div>
    );
};

export default Loader;
