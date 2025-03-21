import { Pagination } from "antd";


export default function Footer({totalPages, pagination}) {

    return (
        <footer>
            <Pagination
                align="center"
                pageSize={10}
                total={totalPages}
                onChange={(page) => {

                }}
            />
        </footer>
    )
}