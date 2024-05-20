const TableMenu=({menuuu}) => {
    console.log(menuuu.menuuu)
    return (<>
        <table>
            <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Price</th>
                <th>Image</th>
            </tr>
            {menuuu.menuuu.map((menuuu)=>{
                return(
                    <tr key={menuuu.Name}>
                        <td>{menuuu.Name}</td>
                        <td>{menuuu.Details}</td>
                        <td>{menuuu.Price}</td>
                        <td><img src={menuuu.img}/></td>
                    </tr>
                )
            })}
        </table>
    </>

    )
}