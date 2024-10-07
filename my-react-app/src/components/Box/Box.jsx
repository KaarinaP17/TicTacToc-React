import './Box.css'
import PropTypes from 'prop-types';

const Box = ({action, value}) => {
  return (
    <div className="cell" onClick={action}>{value}</div>
  )
}

Box.propTypes = {
  action: PropTypes.func.isRequired,  
  value: PropTypes.string.isRequired, 
};

export default Box