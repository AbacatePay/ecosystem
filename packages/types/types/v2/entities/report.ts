/**
 * IDs of the financial reports.
 */
export type ReportId =
	| 'cash_flow'
	| 'revenue_by_method'
	| 'fees_summary'
	| 'receivables_summary'
	| 'disputes_summary'
	| 'withdrawals_summary'
	| 'balance_now';

/**
 * Reports that describe the current moment and take no period.
 */
export type SnapshotReportId = 'receivables_summary' | 'balance_now';

/**
 * An entry of `GET /reports/list`.
 *
 * https://api.abacatepay.com/v2/reports/list
 */
export interface APIReportSpec {
	/**
	 * Report ID.
	 */
	id: ReportId;
	/**
	 * Report title (Portuguese).
	 */
	title: string;
	/**
	 * When to use this report (Portuguese).
	 */
	description: string;
	/**
	 * JSON Schema of the report input.
	 */
	inputSchema: Record<string, unknown>;
}

/**
 * A column of a report.
 */
export interface APIReportColumn {
	/**
	 * Key of the column in each row.
	 */
	key: string;
	/**
	 * Column label (Portuguese).
	 */
	label: string;
	/**
	 * How the raw value was formatted.
	 */
	type: 'money' | 'int' | 'percent' | 'date' | 'text';
}

/**
 * Result of `GET /reports/run`.
 *
 * https://api.abacatepay.com/v2/reports/run
 */
export interface APIReport {
	/**
	 * Report ID.
	 */
	reportId: ReportId;
	/**
	 * Report title (Portuguese).
	 */
	title: string;
	/**
	 * Period covered by the report.
	 */
	period: {
		/**
		 * First day (YYYY-MM-DD).
		 */
		start: string;
		/**
		 * Last day (YYYY-MM-DD).
		 */
		end: string;
		/**
		 * IANA timezone of the period.
		 */
		timezone: string;
	};
	/**
	 * Columns of `rows`.
	 */
	columns: APIReportColumn[];
	/**
	 * Raw totals (Money in cents, percentages in basis points).
	 */
	totals: Record<string, number>;
	/**
	 * Same keys as `totals`, already formatted in pt-BR.
	 */
	formattedTotals: Record<string, string>;
	/**
	 * Up to 40 rows, every value already formatted in pt-BR.
	 */
	rows: Record<string, string>[];
	/**
	 * Number of rows left out of `rows`.
	 */
	rowsOmitted: number;
	/**
	 * Where the numbers came from.
	 */
	provenance: {
		/**
		 * Data sources used.
		 */
		sources: string[];
		/**
		 * Number of documents read.
		 */
		documentsScanned: number;
		/**
		 * When the report was generated.
		 */
		generatedAt: string;
		/**
		 * Currency of the money values.
		 */
		currency: 'BRL';
		/**
		 * Whether the report covers dev mode data.
		 */
		devMode: boolean;
	};
	/**
	 * Caveats (Portuguese).
	 */
	notes: string[];
}
