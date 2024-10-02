import { Droppable } from 'react-beautiful-dnd';
import TodoItem from "../TodoItem"


const Column = (props) => {

    console.log(props)
    const {column,todos,onChangeStatus,onClickDeleteBtn} = props

    return (
        <div className='column'>
            <h2>{column.name}</h2>
            <Droppable droppableId = {column.id}>
                {(provided) => (
                    <div innerRef={provided.innerRef} {...provided.droppableProps}>
                        {todos.map((todo,index) => (
                            <TodoItem key={todo.id} index = {index} item={todo} onChangeStatus={onChangeStatus} onClickDeleteBtn={onClickDeleteBtn} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}


export default Column;