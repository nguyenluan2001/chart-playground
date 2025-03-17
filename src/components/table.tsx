import Table, { type ColumnsType } from "antd/es/table";
import { useState } from "react";

const TableTest = () => {
	const [studyId, setStudyId] = useState<string>("");
	const [dataSource, setDataSource] = useState([
		{
			study_title: "GRUBER_EAE",
			study_hash_id: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK3",
			uuid: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK31",
		},
		{
			study_title: "GRUBER_EAE",
			study_hash_id: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK3",
			uuid: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK32",
		},
		{
			study_title: "GRUBER_EAE",
			study_hash_id: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK3",
			uuid: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK33",
		},
		{
			study_title: "GRUBER_EAE",
			study_hash_id: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK3",
			uuid: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK34",
		},
		{
			study_title: "GRUBER_EAE",
			study_hash_id: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK3",
			uuid: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK35",
		},
		{
			study_title: "GRUBER_EAE",
			study_hash_id: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK3",
			uuid: "PJ-01JFZ4PTD30R3QD6RCJ9JWFPK36",
		},
	]);
	const columns: ColumnsType<any> = [
		{
			title: "Study title",
			key: "study_title",
			dataIndex: "study_title",
		},
		{
			title: "Study hash id",
			key: "study_hash_id",
			dataIndex: "study_hash_id",
		},
		{
			title: "UUID",
			key: "uuid",
			dataIndex: "uuid",
		},
	];
	return (
		<div style={{ width: 1000, height: 1000 }}>
			<Table
				columns={columns}
				dataSource={dataSource}
				rowKey={"uuid"}
				rowSelection={{
					selectedRowKeys: [studyId],
					onSelect: (record, selected, selectedRows) => {
						setStudyId(record?.uuid);
					},
				}}
				onRow={(record) => {
					return {
						className: "cursor-pointer",
						style: {
							cursor: "pointer",
						},
						onClick: () => {
							if (studyId === record?.uuid) {
								return setStudyId("");
							}
							setStudyId(record?.uuid);
						},
					};
				}}
			/>
		</div>
	);
};
export default TableTest;
