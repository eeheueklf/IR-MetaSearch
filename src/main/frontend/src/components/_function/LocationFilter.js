// import React, { useState } from 'react';
// import styled from 'styled-components';
//
// const LocationFilter = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   background: #f7f9fb;
//   border-radius: 12px;
//   padding: 24px;
//   margin-bottom: 24px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.04);
// `;
//
// const Label = styled.label`
//   font-weight: 600;
//   margin-bottom: 8px;
// `;
//
// const SliderWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
// `;
//
// const RangeInput = styled.input`
//   width: 200px;
//   accent-color: #222;
// `;
//
// function SearchFilter() {
//     const [radius, setRadius] = useState(25);
//
//     return (
//         <LocationFilter>
//             <Label>위치 기반 반경</Label>
//             <SliderWrapper>
//                 <RangeInput
//                     type="range"
//                     min={0}
//                     max={100}
//                     value={radius}
//                     onChange={e => setRadius(Number(e.target.value))}
//                 />
//                 <span>{radius} km</span>
//             </SliderWrapper>
//         </LocationFilter>
//     );
// }
// export default LocationFilter();