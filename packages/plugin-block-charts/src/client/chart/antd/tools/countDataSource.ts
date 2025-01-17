export function countDataSource(dataSource, measures, transform) {
  measures?.forEach((dataValue) => {
    const countData = (data) => {
      data.forEach((value) => {
        if (!value.children?.length) return;
        const dataKey = dataValue.field.join('.');
        if (isNaN(Number(value[dataKey]))) {
          value[dataKey] = 0;
        }
        let number: any = transform.filter((value) => value.field === dataKey)[0];
        if (number) {
          number = number.specific ? number.specific : 3;
          switch (number) {
            case 'TwoDigits':
              number = 2;
              break;
            case 'ThreeDigits':
              number = 3;
              break;
            case 'FourDigits':
              number = 4;
              break;
          }
        } else {
          number = 3;
        }
        const options: Intl.NumberFormatOptions = {
          style: 'decimal',
          minimumFractionDigits: number,
          maximumFractionDigits: number,
        };

        const numberFormat = new Intl.NumberFormat('zh-CN', options);
        const num = String(value[dataKey]).includes(',') ? String(value[dataKey]).replace(/,/g, '') : value[dataKey];
        if (!isNaN(num)) {
          const sum = value.children.reduce((sum, curr) => {
            const sub = String(curr[dataKey]).includes(',')
              ? String(curr[dataKey]).replace(/,/g, '')
              : isNaN(Number(curr[dataKey]))
                ? 0
                : curr[dataKey];
            return sum + parseFloat(sub);
          }, 0);
          value[dataKey] = numberFormat.format(sum || 0);
        }
        if (value.children) {
          countData(value.children);
        }
      });
    };
    countData(dataSource);
  });
}
