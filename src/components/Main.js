import Layout from "@/Layout";
import { TournamentStyle } from "@/styles/TournamentStyle";
import React, { Fragment, useCallback, useEffect, useState } from "react";

const Main = ({ title }) => {
    const [mode, setMode] = useState(""); // 복식 or 단식 선택
    const [players, setPlayers] = useState([]); // 선수명 입력 관리
    const [tournament, setTournament] = useState([]); // 토너먼트 결과 저장
    const [winners, setWinners] = useState([]); // 이긴 팀 저장
    const [losers, setLosers] = useState([]); // 진 팀 저장

    // 페이지 로드 시 로컬스토리지에서 선수 불러오기
    // 페이지 로드 시 로컬스토리지에서 선수 불러오기
    useEffect(() => {
        const savedPlayers = JSON.parse(localStorage.getItem("players"));
        if (savedPlayers && savedPlayers.length > 0) {
            setPlayers(savedPlayers);
        }
    }, []);

    // 모드가 바뀔 때마다 초기값 설정
    const handleModeChange = (e) => {
        const selectedMode = e.target.value;
        setMode(selectedMode);
        if (players.length === 0) {
            setPlayers(Array(selectedMode === "복식" ? 4 : 2).fill(""));
        }
    };

    // 선수명 입력 처리
    const handlePlayerChange = (index, e) => {
        const newPlayers = [...players];
        newPlayers[index] = e.target.value;
        setPlayers(newPlayers);
    };

    // 추가 버튼 눌렀을 때 input 추가
    const addPlayer = () => {
        setPlayers([...players, ""]);
    };

    // 선수명 삭제
    const removePlayer = (index) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
    };

    // 입력한 선수 정보를 로컬 스토리지에 저장
    const savePlayersToLocalStorage = () => {
        if (players.every((player) => player.trim() !== "")) {
            localStorage.setItem("players", JSON.stringify(players));
            alert("선수 정보가 저장되었습니다.");
        } else {
            alert("모든 선수 이름을 입력해주세요.");
        }
    };

    // 로컬 스토리지에서 선수 정보를 불러오기
    const loadPlayersFromLocalStorage = () => {
        const savedPlayers = JSON.parse(localStorage.getItem("players"));
        if (savedPlayers && savedPlayers.length > 0) {
            setPlayers(savedPlayers);
            alert("저장된 선수 정보를 불러왔습니다.");
        } else {
            alert("저장된 선수 정보가 없습니다.");
        }
    };

    // 랜덤으로 배열 섞기
    const shuffleArray = (array) => {
        return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    };

    // 로컬 스토리지에서 선수 정보를 불러와 토너먼트 생성
    const generateTournament = () => {
        const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

        if (mode === "복식" && storedPlayers.length < 4) {
            alert("복식 모드에서는 최소 4명의 선수가 필요합니다.");
            return;
        }
        if (mode === "단식" && storedPlayers.length < 2) {
            alert("단식 모드에서는 최소 2명의 선수가 필요합니다.");
            return;
        }

        // 선수 리스트 랜덤 섞기
        let shuffledPlayers = shuffleArray(storedPlayers);

        const matchSize = mode === "복식" ? 4 : 2;

        // 남은 선수를 처리하는 로직
        const remainingPlayersCount = shuffledPlayers.length % matchSize;
        if (remainingPlayersCount > 0) {
            const remainingPlayers = shuffledPlayers.splice(
                -remainingPlayersCount
            );

            const requiredAdditionalPlayers = matchSize - remainingPlayersCount;
            const additionalPlayers = [];

            while (additionalPlayers.length < requiredAdditionalPlayers) {
                const randomPlayer =
                    shuffledPlayers[
                        Math.floor(Math.random() * shuffledPlayers.length)
                    ];
                if (!additionalPlayers.includes(randomPlayer)) {
                    additionalPlayers.push(randomPlayer);
                }
            }

            shuffledPlayers.push(...remainingPlayers, ...additionalPlayers);
            alert(
                `${remainingPlayers.join(", ")} 선수는 ${additionalPlayers.join(
                    ", "
                )} 선수들과 함께 경기에 추가로 참여하게 됩니다.`
            );
        }

        // 팀 또는 매치 구성
        const tournamentTeams = [];
        for (let i = 0; i < shuffledPlayers.length; i += matchSize) {
            const match = shuffledPlayers.slice(i, i + matchSize);

            if (mode === "복식") {
                tournamentTeams.push({
                    type: "복식",
                    players:
                        match.slice(0, 2).join(", ") +
                        " vs " +
                        match.slice(2, 4).join(", "),
                    team: match,
                    isBYE: false, // 부전승 체크
                });
            } else {
                tournamentTeams.push({
                    type: "단식",
                    players: match[0] + " vs " + match[1],
                    team: match,
                    isBYE: false, // 부전승 체크
                });
            }
        }
        setTournament([
            {
                playIndex: 0,
                playList: tournamentTeams,
            },
        ]);

        // 토너먼트 상태 저장
        const tournamentData = [
            {
                playIndex: 0,
                playList: tournamentTeams,
            },
        ];
        setTournament(tournamentData);

        // 토너먼트를 로컬스토리지에 저장
        localStorage.setItem("tournament", JSON.stringify(tournamentData));
    };

    // 토너먼트 불러오기 함수
    const loadTournament = () => {
        const savedTournament = JSON.parse(localStorage.getItem("tournament"));
        if (savedTournament && savedTournament.length > 0) {
            setTournament(savedTournament);
            alert("저장된 토너먼트 정보를 불러왔습니다.");
        } else {
            alert("저장된 토너먼트 정보가 없습니다.");
        }
    };

    // 토너먼트 순서 변경 함수 (위로 이동)
    const moveUp = (index, playIndex) => {
        if (index > 0) {
            // 기존 상태를 변경하지 않고 새로운 배열을 생성하여 업데이트
            const newTournament = [...tournament];
            const newPlayList = [...newTournament[playIndex].playList];

            // 순서를 변경
            [newPlayList[index], newPlayList[index - 1]] = [
                newPlayList[index - 1],
                newPlayList[index],
            ];

            // 새로운 상태로 갱신
            newTournament[playIndex].playList = newPlayList;
            setTournament(newTournament);
        }
    };

    // 토너먼트 순서 변경 함수 (아래로 이동)
    const moveDown = (index, playIndex) => {
        if (index < tournament[playIndex].playList.length - 1) {
            // 기존 상태를 변경하지 않고 새로운 배열을 생성하여 업데이트
            const newTournament = [...tournament];
            const newPlayList = [...newTournament[playIndex].playList];

            // 순서를 변경
            [newPlayList[index], newPlayList[index + 1]] = [
                newPlayList[index + 1],
                newPlayList[index],
            ];

            // 새로운 상태로 갱신
            newTournament[playIndex].playList = newPlayList;
            setTournament(newTournament);
        }
    };

    // 이긴 팀 선택 후 해당 팀을 다음 경기로 진행
    const selectWinner = (team, players) => {
        // 이긴 팀을 winners 배열에 추가
        const teamMembers = team.split(",");

        // 이긴 팀을 winners 배열에 추가
        setWinners([...winners, teamMembers]);

        // 패자를 자동으로 losers 배열에 추가
        const loser = players.find((player) => !teamMembers.includes(player));
        setLosers([...losers, loser]);

        // 현재 경기를 토너먼트 목록에서 삭제
        setTournament(tournament.filter((t) => t !== team));

        alert(`${teamMembers.join(", ")} 팀이 승리하였습니다!`);
    };

    // 다음 경기를 생성하기 위해, 이긴 팀만 추출하여 토너먼트 진행
    const generateNextMatch = () => {
        if (winners.length < 2) {
            alert("두 팀 이상을 선택해야 다음 경기를 진행할 수 있습니다.");
            return;
        }

        // 다음 경기 대진 생성
        let winList = winners;
        const nextMatches = [];

        // 홀수 팀이 있을 경우 마지막 팀은 부전승 처리
        if (winList.length % 2 !== 0) {
            // 마지막 팀은 부전승 처리
            const msg = `${winList[winList.length - 1].join(", ")} (부전승)`;
            nextMatches.push({
                type: mode,
                players: msg,
                match: winList[winList.length - 1],
                isBYE: true,
            });
            // 홀수 팀을 제외하고 대진을 구성
            winList = winList.slice(0, winList.length - 1);
        }

        // 2팀씩 묶어서 경기 대진 생성
        for (let i = 0; i < winList.length; i += 2) {
            if (winList[i + 1]) {
                nextMatches.push({
                    type: mode,
                    players:
                        winList[i].join(", ") +
                        " vs " +
                        winList[i + 1].join(", "),
                    match: [...winList[i], ...winList[i + 1]],
                    isBYE: false,
                });
            }
        }

        console.log("tournament", tournament);
        console.log("nextMatches", nextMatches);
        setTournament([
            ...tournament,
            {
                playIndex: tournament.length++,
                playList: nextMatches,
            },
        ]);
        setWinners([]);
    };

    return (
        <Layout pageTitle={title}>
            <TournamentStyle>
                <div>
                    <div className="playType">
                        <h3>팀 배정 방식 선택</h3>
                        <label>
                            <input
                                type="radio"
                                value="복식"
                                checked={mode === "복식"}
                                onChange={handleModeChange}
                            />
                            복식 (2:2)
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="단식"
                                checked={mode === "단식"}
                                onChange={handleModeChange}
                            />
                            단식 (1:1)
                        </label>
                    </div>
                    {mode && (
                        <div className="playerList">
                            <h3>{mode} 선수 입력</h3>
                            <button
                                onClick={loadPlayersFromLocalStorage}
                                className="btn-load"
                            >
                                불러오기
                            </button>
                            <ul>
                                {players.map((player, index) => (
                                    <li key={index}>
                                        <label>선수 {index + 1}</label>
                                        <input
                                            type="text"
                                            value={player}
                                            onChange={(e) =>
                                                handlePlayerChange(index, e)
                                            }
                                            placeholder={`선수 ${
                                                index + 1
                                            } 이름 입력`}
                                        />
                                        <button
                                            onClick={() => removePlayer(index)}
                                            className="btn-delete"
                                        >
                                            삭제
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="btn-wrap">
                                <button onClick={addPlayer} className="btn-add">
                                    선수 추가
                                </button>
                                <button
                                    onClick={savePlayersToLocalStorage}
                                    className="btn-save"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="tournament-wrap">
                        <h4>토너먼트 생성</h4>
                        <button
                            onClick={generateTournament}
                            className="btn-add"
                        >
                            토너먼트 생성
                        </button>
                        <button onClick={loadTournament}>
                            토너먼트 불러오기
                        </button>
                        <ul>
                            {tournament.map(
                                ({ playIndex, playList }, playIndexOuter) => {
                                    // playList가 있는지 확인하고, map을 실행
                                    return (
                                        playList &&
                                        playList.length > 0 && (
                                            <Fragment key={playIndexOuter}>
                                                {playList.map((team, index) => {
                                                    const players =
                                                        team.players.split(
                                                            " vs "
                                                        );
                                                    return (
                                                        <li key={index}>
                                                            <span className="playindex-txt">
                                                                {playIndex + 1}
                                                                번째 경기
                                                            </span>
                                                            {team.isBYE ? (
                                                                `${team.players}`
                                                            ) : (
                                                                <>
                                                                    <span className="tournament-item">
                                                                        <em
                                                                            onClick={() =>
                                                                                selectWinner(
                                                                                    players[0],
                                                                                    players
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                players[0]
                                                                            }
                                                                        </em>
                                                                        vs{" "}
                                                                        <em
                                                                            onClick={() =>
                                                                                selectWinner(
                                                                                    players[1],
                                                                                    players
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                players[1]
                                                                            }
                                                                        </em>
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            moveUp(
                                                                                index,
                                                                                playIndex
                                                                            )
                                                                        }
                                                                        className="btn-up"
                                                                    >
                                                                        위로
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            moveDown(
                                                                                index,
                                                                                playIndex
                                                                            )
                                                                        }
                                                                        className="btn-down"
                                                                    >
                                                                        아래로
                                                                    </button>
                                                                </>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </Fragment>
                                        )
                                    );
                                }
                            )}
                        </ul>
                    </div>

                    <div className="next-play-wrap">
                        <h4>다음 경기를 생성</h4>
                        <button
                            onClick={() => generateNextMatch()}
                            className="btn-add"
                        >
                            다음 경기 생성
                        </button>
                    </div>
                </div>
            </TournamentStyle>
        </Layout>
    );
};

export default Main;
